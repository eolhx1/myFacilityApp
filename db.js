//
// filename: ./db.js
//
// IndexedDB-hantering för applikationen.
//

// ==========================================================================
// 1. KONSTANTER & GLOBAL STATE
// ==========================================================================

const DB_NAME = "myFacilityAppDB";
const DB_VERSION = 1;

let db = null;

// ==========================================================================
// 2. INITIERING
// ==========================================================================
export async function initDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, DB_VERSION);

		// ----------------------------------
		// Skapa object stores
		// ----------------------------------
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

// ==========================================================================
// 3. FAVORITER
// ==========================================================================

// ----------------------------------
// Lägg till favorit
// ----------------------------------

export async function addFavorite(calcId) {
    ensureDB();

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

// ----------------------------------
// Ta bort favorit
// ----------------------------------

export async function removeFavorite(calcId) {
    ensureDB();

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

// ----------------------------------
// Hämta favoriter
// ----------------------------------

export async function getFavorites() {
    ensureDB();

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

// ----------------------------------
// Kontrollera favoritstatus
// ----------------------------------

export async function isFavorite(calcId) {
    ensureDB();

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

// ==========================================================================
// 4. HJÄLPFUNKTIONER
// ==========================================================================

function ensureDB() {
    if (!db) {
        throw new Error("Database not initialized");
    }
}