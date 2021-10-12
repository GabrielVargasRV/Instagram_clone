import { db } from "../firebase"

interface whereInter {
    path:string;
    opStr:any;
    value: any;
}

interface docInter {
    path: any;
    collection?: string;
    doc?:docInter;
}

export const get = async (collection:string,where:whereInter,doc:docInter | null,callback:(res:any) => void) => {
    if(doc && !doc.collection){
        const res = await db.collection(collection).doc(doc.path).get()
        return callback(res)
    }else if (doc && doc.collection && !doc.doc) {
        const res = await db.collection(collection).doc(doc.path).collection(doc.collection).get()
        return callback(res)
    }else if(doc && doc.collection && doc.doc){
        const res = await db.collection(collection).doc(doc.path).collection(doc.collection).doc(doc.doc.path).get()
        return callback(res)
    }else if(!doc){
        const res = await db.collection(collection).where(where.path,where.opStr,where.value).get()
        return callback(res)
    }
}

export const set = async (collection:string,doc:docInter,setObject:any,callback:(res:any) => void) => {
    if(doc && !doc.collection){
        const res = await db.collection(collection).doc(doc.path).set(setObject)
        return callback(res)
    }else if(doc && doc.collection && doc.doc){
        const res = await db.collection(collection).doc(doc.path).collection(doc.collection).doc(doc.doc.path).set(setObject)
        return callback(res)
    }
}

export const del = async (collection:string,doc:docInter,callback:(res:any) => void) => {
    if(doc && !doc.collection){
        const res = await db.collection(collection).doc(doc.path).delete()
        return callback(res)
    }else if(doc && doc.collection && doc.doc){
        const res = await db.collection(collection).doc(doc.path).collection(doc.collection).doc(doc.doc.path).delete()
        return callback(res)
    }
}

export const add = async (collection:string,doc:docInter,addObj:any,callback:(res:any) => void) => {
    if(doc && doc.collection){
        const res = await db.collection(collection).doc(doc.path).collection(doc.collection).add(addObj)
        return callback(res)
    }else if(!doc){
        const res = await db.collection(collection).add(addObj)
        return callback(res)
    }
}