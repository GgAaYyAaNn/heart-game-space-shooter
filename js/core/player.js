import {auth, db, firebaseAuth, firebaseDB, provider} from "./firebaseConfig.js";

const Player = (() => {
    let score = 0;
    let name = ""; // "Gayan Jeewantha";

    let avatarSrc = "";
    let loggedIn = false;

    firebaseAuth.setPersistence(auth, firebaseAuth.browserLocalPersistence);
    firebaseAuth.onAuthStateChanged(auth, async (user) => {
        if (user) {
            loggedIn = true;
            name = user["displayName"];
            avatarSrc = user["photoURL"];

            const userRef = firebaseDB.ref(db, `space-shooter-scores/${user.uid}`);
            const snapshot = await firebaseDB.get(userRef);
            if (snapshot.exists()) {
                const scoreData = snapshot.val();
                // console.log("user's score", scoreData);
                score = scoreData.score;
            } else {
                score = 0;
            }
        } else {
            loggedIn = false;
            name = "";
            avatarSrc = "";
        }
        window.dispatchEvent(new CustomEvent("auth-changed"));
    });

    function getName() {
        return name;
    }

    function getScore() {
        return score;
    }

    function getAvatarSrc(){
        return avatarSrc;
    }

    function incrementScore(by){
        score += by;
        const user = firebaseAuth.getAuth().currentUser;
        if (!user) return;
        const userRef = firebaseDB.ref(db, `space-shooter-scores/${user.uid}`);
        void firebaseDB.set(userRef, {
            score: score,
            name: user.displayName,
            timestamp: Date.now(),
        });
    }

    function isLoggedIn(){
        return loggedIn;
    }

    async function login(){
        try{
            await firebaseAuth.signInWithPopup(auth, provider)
        } catch (e){
            console.log(e);
        }
        window.dispatchEvent(new CustomEvent("auth-changed"));

    }

    async function logout(){
        score = 0;
        await firebaseAuth.signOut(auth)
    }

    async function getTopPlayers(limit = 10) {
        try {
            const scoresQuery = firebaseDB.query(
                firebaseDB.ref(db, "space-shooter-scores"),
                firebaseDB.orderByChild("score"),
                firebaseDB.limitToLast(limit)
            );

            const snapshot = await firebaseDB.get(scoresQuery);
            if (!snapshot.exists()) {
                return [];
            }

            const players = [];
            snapshot.forEach(childSnapshot => {
                players.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });

            players.reverse();
            return players;
        } catch (error) {
            console.error("failed to get leaderboard:", error);
            return [];
        }
    }

    return {
        getScore,  incrementScore, getTopPlayers,
        getName, isLoggedIn, login, logout, getAvatarSrc
    }
})()


export default Player;
