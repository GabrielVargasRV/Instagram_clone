import * as api from "../utilities/api";
import { userDataType } from "../types/user.types";
import {db} from "../firebase";

export const getUserData = async (uid: string): Promise<{}> => {
    let userData_snapshot: any; // change the type
    const followers: string[] = []; // change the type
    const following: string[] = []; // change the type

    await api.get("userData", null, { path: uid }, (res) => {
        userData_snapshot = res;
    });

    await api.get("userData",null,{path: uid, collection: "followers"},(res) => {
        if(res.docs.length > 0) res.docs.forEach((follower: any) => followers.push(follower.id))
    });

    await api.get("userData",null,{ path: uid, collection: "following" },(res) => {
        if (res.docs.lenght) res.docs.forEach((f: any) => following.push(f.id));
    });

    return{
        ...userData_snapshot.data(),
        followers,
        following,
    }
}

export const getProfile = async (profileUsername: string): Promise<{}> => {
    let profile_snapshot: any;
    const following: any = [];
    const followers: any = [];
    const posts: any = [];

    await api.get("userData",{ path: "username", opStr: "==", value: profileUsername },null,(res) => {
        profile_snapshot = res.docs[0];
    });

    await api.get("userData",null,{ path: profile_snapshot.data().uid, collection: "following" },(res) => {
        if (res.docs) res.docs.forEach((f: any) => following.push(f.data()));
    });

    await api.get("userData",null,{ path: profile_snapshot.data().uid, collection: "followers" },(res) => {
        if (res.docs) res.docs.forEach((f: any) => followers.push(f.data()));
    });

    await api.get("posts",{ path: "username", opStr: "==", value: profileUsername },null,(res) => {
        if (res.docs) res.docs.forEach((post: any) => posts.push({ id: post.id, ...post.data() }));
    });
    return {
        posts,
        followers,
        following,
        ...profile_snapshot.data(),
    };
};


export const follow = async (username: string, userData: userDataType): Promise<undefined> => {
    let info: any = null;
    await api.get("userData",{ path: "username", opStr: "==", value: username },null,(res) => {
        info = res;
    });

    await api.set("userData",{ path: userData.uid, collection: "following", doc: { path: username } },{photoURL: info.docs[0].data().photoURL,username,name: info.docs[0].data().name,},(res: any) => {});

    await api.set("userData",{path: info.docs[0].data().uid,collection: "followers",doc: { path: userData.username },},{photoURL: userData.photoURL,username: userData.username,name: userData.name,},(res) => {});

    await api.add("userData",{ path: info.docs[0].data().uid, collection: "activity" },{type: "follow",username: userData.username,message: "started following you",data: Date.now(),},(res) => {});

    return;
};

export const unFollow = async (uid: string,username: string,myUid: string,myUsername: string): Promise<undefined> => {
    await api.del("userData",{ path: uid, collection: "followers", doc: { path: myUsername } },(res) => {});
    await api.del("userData",{ path: myUid, collection: "following", doc: { path: username } },(res) => {});
    return;
};


export const getUsers = async (userData:userDataType): Promise<[]> => {
    let users = null;
    if (userData.following.length) {
      const snapshot = await db
        .collection("userData")
        .where("username", "not-in", userData.following)
        .limit(5)
        .get();
      const arr:any = [];
      snapshot.docs.forEach((u) => {
        if (u.data().uid !== userData.uid) {
          arr.push(u.data());
        }
      });
      users = arr;
    } else {
      const snapshot = await db.collection("userData").limit(5).get();
      const arr:any = [];
      snapshot.docs.forEach((u) => {
        if (u.data().uid !== userData.uid) {
          arr.push(u.data());
        }
      });
      users = arr;
    }

    return users;
};