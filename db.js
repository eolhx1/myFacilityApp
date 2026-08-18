//
// filename: ./db.js
//

const DB_NAME = "myFacilityAppDB";
const DB_VERSION = 1;

let db = null;

export async function initDB() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);

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
                "IndexedDB initialized"
            );

            resolve();
        };

        request.onerror = () => {

            reject(request.error);
        };
    });
}

// Används denna
export function getDB() {
    return db;
}

// ==========================================================================
// Favoriter
// ==========================================================================
export async function addFavorite(calcId) {

    if (!db) {
        throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                "favorites",
                "readwrite"
            );

        const store =
            tx.objectStore("favorites");

        const request =
            store.put({
                calcId
            });

        request.onsuccess =
            () => resolve();

        request.onerror =
            () => reject(request.error);
    });
}

export async function removeFavorite(calcId) {

	if (!db) {
		throw new Error("Database not initialized");
	}
	
    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                "favorites",
                "readwrite"
            );

        const store =
            tx.objectStore("favorites");

        const request =
            store.delete(calcId);

        request.onsuccess =
            () => resolve();

        request.onerror =
            () => reject(request.error);
    });
}

export async function getFavorites() {
	
	if (!db) {
		throw new Error("Database not initialized");
	}

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                "favorites",
                "readonly"
            );

        const store =
            tx.objectStore("favorites");

        const request =
            store.getAll();

        request.onsuccess =
            () => resolve(
                request.result.map(
                    item => item.calcId
                )
            );

        request.onerror =
            () => reject(request.error);
    });
}

export async function isFavorite(calcId) {

    if (!db) {
        throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                "favorites",
                "readonly"
            );

        const store =
            tx.objectStore("favorites");

        const request =
            store.get(calcId);

        request.onsuccess =
            () => resolve(!!request.result);

        request.onerror =
            () => reject(request.error);
    });
}

db.onclose = () => {
    db = null;
};

db.onerror = (event) => {
    console.error(event);
};