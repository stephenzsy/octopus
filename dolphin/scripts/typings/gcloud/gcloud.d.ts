declare module gcloud {
    export interface Config {
        keyFilename:string;
        projectId:string;
    }

    export interface Service {
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

    export interface Datastore extends Service {
        dataset(config:Config): Datastore.Dataset;

        int(value:number):Datastore.Integer;
        double(value:number):Datastore.Double;
    }

    export interface GCloud {
        (config:Config):GCloud;

        datastore:Datastore;
    }
}

declare
var gcloud:gcloud.GCloud;

declare module "gcloud" {
    export = gcloud;
}