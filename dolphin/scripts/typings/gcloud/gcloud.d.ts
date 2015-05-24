/// <reference path="../node/node.d.ts"/>

declare module gcloud {
    export interface Config {
        keyFilename:string;
        projectId:string;
    }

    export interface Service {
    }

    export module Storage {

        export interface Bucket {
            file(name:string):File;
        }

        export interface FileMetadata {
            contentType?: string;
            mediaLink?:string;
            metadata?: {[s:string]:string};
        }

        export interface File {
            createWriteStream(options:{
                metadata: FileMetadata;
                resumable?: boolean;
                validation?:boolean|string;
            }):NodeJS.WritableStream;

            createReadStream():NodeJS.ReadableStream;
        }
    }

    export interface Storage extends Service {
        bucket(buckentName:string): Storage.Bucket;
    }

    export module Datastore {
        export interface Integer {
        }

        export interface Double {
        }

        export interface Key {
        }

        export interface Entity {
            key:Key;
            data:any;
        }

        export interface Query {
            filter(filter:string, value:any):Query;
            order(property:string):Query;
            limit(n:number):Query;
        }

        export interface Dataset {
            key(path:string[]): Key;
            save(entity:Entity, callback:(err:any)=>any):void;
            createQuery(kind:string):Query;
            runQuery(q:Query, callback:(err:any, entities:Entity[], endCursor:any)=>any):void;
        }
    }

    export interface DatastoreStatic {
        dataset(config:Config): Datastore.Dataset;

        int(value:number):Datastore.Integer;
        double(value:number):Datastore.Double;
    }

    export interface GCloud {
        dataset():Datastore.Dataset;
        storage():Storage;
    }


    export interface GCloudStatic {
        (config:Config):GCloud;
        datastore:DatastoreStatic;
    }
}

declare
var gcloud:gcloud.GCloudStatic;

declare module "gcloud" {
    export  = gcloud;
}
