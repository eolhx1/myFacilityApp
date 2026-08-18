//
// filename: ./db.js
//

const DB_NAME = "myFacilityAppDB";
const DB_VERSION = 1;

let db = null;

export async function initDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );

        request.onupgradeneeded = (event) => {

            const database =
                event.target.result;

            if (!database.objectStoreNames.contains("favorites")) {

                database.createObjectStore(
                    "favorites",
                    {
                        keyPath: "calcId"
                    }
                );
            }

            if (!database.objectStoreNames.contains("recent")) {

                database.createObjectStore(
                    "recent",
                    {
                        keyPath: "calcId"
                    }
                );
            }

            if (!database.objectStoreNames.contains("jobs")) {

                database.createObjectStore(
                    "jobs",
                    {
                        keyPath: "id"
                    }
                );
            }
        };

        request.onsuccess = () => {

            db = request.result;

            console.log(
                "IndexedDB ready"
            );

            resolve(db);
        };

        request.onerror = () => {

            reject(
                request.error
            );
        };
    });
}

export function getDB() {
    return db;
}