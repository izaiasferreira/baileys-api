const updateChatDatabase = async (dbName, dbVersion, objectStoreName, array) => {
    const db = await openDatabase(dbName, dbVersion, objectStoreName);
    const transaction = db.transaction(objectStoreName, 'readwrite');
    const store = transaction.objectStore(objectStoreName);
    await store.clear();
    for (let index = 0; index < array.length; index++) {
        store.add(array[index]);
    }

    // transaction.oncomplete = (event) => {
    //     console.log('Mensagens adicionadas com sucesso!');
    // };

    transaction.onerror = (event) => {
        console.error('Erro ao adicionar mensagens:', event.target.error);
    };
}

const openDatabase = (dbName, dbVersion, objectStoreName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = (event) => {
            console.error('Erro ao abrir o banco de dados:', event.target.error);
            reject(event.target.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            //console.log('Banco de dados aberto com sucesso!');
            resolve(db);
        };

        request.onblocked = () => {
            console.error('O banco de dados está bloqueado por outra conexão aberta.');
            reject(new Error('Banco de dados bloqueado'));
        };
    });
}



const deleteDatabase = async (dbName, dbVersion, objectStoreName) => {
    const db = await openDatabase(dbName, dbVersion, objectStoreName);
    const transaction = db?.transaction(objectStoreName, 'readwrite');
    const store = transaction?.objectStore(objectStoreName);
    await store?.clear();
    console.log('banco de dados excluído com sucesso!', dbName, dbVersion, objectStoreName);
    // return new Promise((resolve, reject) => {
    //     const request = indexedDB.deleteDatabase(dbName);

    //     request.onerror = (event) => {
    //         console.error('Erro ao excluir o banco de dados:', event.target.error);
    //         reject(event.target.error);
    //     };

    //     request.onsuccess = (event) => {
    //         console.log('Banco de dados excluído com sucesso!');
    //         resolve();
    //     };
    // });
    return
}



const getChats = async (dbName, dbVersion, objectStoreName) => {
    const db = await openDatabase(dbName, dbVersion, objectStoreName);
    const transaction = db.transaction(objectStoreName, 'readonly');
    const store = transaction.objectStore(objectStoreName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        transaction.oncomplete = (event) => {
            resolve(request.result);
        };

        transaction.onerror = (event) => {
            reject(event.target.error);
        };
    });
}



export {
    updateChatDatabase,
    openDatabase,
    deleteDatabase,
    getChats,
}