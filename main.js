
  const statusElm = document.getElementById("status")
  const dbnameField = document.getElementById("dbname")
  const openButton = document.getElementById("open")
  
  function handleError(e) {
    console.error(e.stack)
    statusElm.innerHTML = e.message
  }
    
  const main = (IPFS, ORBITDB) => {
    let orbitdb
    // If we're building with Webpack, use the injected IPFS module.
    // Otherwise use 'Ipfs' which is exposed by ipfs.min.js
    if (IPFS)
      Ipfs = IPFS
    // If we're building with Webpack, use the injected OrbitDB module.
    // Otherwise use 'OrbitDB' which is exposed by orbitdb.min.js
    if (ORBITDB)
      OrbitDB = ORBITDB
  
    // Init UI
    openButton.disabled = true
    statusElm.innerHTML = "Inciando IPFS..."
  
    // Crando instancia IPFS
    const ipfs = new Ipfs({
      EXPERIMENTAL: {
        pubsub: true,
      },
    })
  //Catch errores ipfs
    ipfs.on('error', (e) => handleError(e))
    ipfs.on('ready', async () => {
        const files = [
            {
                path: '/deca.png',
                content:  Ipfs.Buffer.from('Hola mundo desde DECA')
            }
        ] //PROBAMOS LA CONEXION IPFS
      console.log("IPFS:", ipfs);
      const results = await ipfs.add(files)
      console.log("Imagen: ",results);
      openButton.disabled = false
      statusElm.innerHTML = "IPFS Started"

      orbitdb = await OrbitDB.createInstance(ipfs)//Creamos la base
      console.log("orbitdb:", orbitdb);
      const db = await orbitdb.keyvalue('deca-first-database');
      await db.load();
      let hash = await db.put('name', 'Hola mundo desde DECA orbitdb');
      const value = db.get("/orbitdb/zdpuAxptgUXENe2MWJPPThz3mwRanw8k5jfpHEP53SCpiWjXM/deca-database");
      console.log("Se añadio:",value);

     
      const hash_db = await orbitdb.keyvalue('deca-database')
      const hash_message=hash_db;
      dbnameField.innerHTML="ID:"+hash_message.id;
  })
}
  openButton.addEventListener('click', openDatabase)

  
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = main
  