const express= require('express');
const app=express();
const cors=require('cors');
const admin=require("firebase-admin");
const serviceAccount=require("./permisos.json");

app.use(cors({origin: true}));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


const db=admin.firestore();


app.use(express.json());

app.use(express.urlencoded({extended:true}));
//Metodos

app.post('/create', async(req, res)=>{
    try{
        console.log(req.body);
        const jsonBody={
            nombre:req.body.nombre,
            marca:req.body.marca,
            precio:req.body.precio,
            almacenamiento:req.body.almacenamiento,
            color:req.body.color,
            foto:req.body.foto,
            tipoDispostivo:req.body.tipoDispostivo

        };
        await db.collection('productos').add(jsonBody)
        res.send('Producto creado');
    }catch(error){
        res.send(error)
        console.log(error)
    }
       
        
});

app.get('/read', async(req, res)=>{
    try{
        const querySnapshot=await db.collection('productos').get();
        const docs=[];
        querySnapshot.forEach((doc)=>{
            docs.push({...doc.data()});
        });
        res.json(docs);
    }catch(error){
        res.send(error);
    }
})


app.get('/tipo/:tipoDispositivo', async (req, res) => {
    try {
      const tipoDispositivo = req.params.tipoDispositivo;
      const productosRef = db.collection('productos');
      const query = productosRef.where('tipoDispositivo', '==', tipoDispositivo);
      const snapshot = await query.get();
      const productos = snapshot.docs.map(doc => doc.data());
      res.send(productos);
    } catch (error) {
      res.send(error);
    }
  });

//Buscar por nombre
app.get('/search/:nombre', async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const productosRef = db.collection('productos');
        const query = productosRef.where('nombre', '==', nombre);
        const snapshot = await query.get();
        const productos = snapshot.docs.map(doc => doc.data());
        res.send(productos);
        console.log(productos);
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});


    app.get('/productbrand/:marca', async (req, res) => {
    try {
        const marca = req.params.marca;
        const productosRef = db.collection('productos');
        const query = productosRef.where('marca', '==', marca);
        const snapshot = await query.get();
        const productos = snapshot.docs.map(doc => doc.data());
        res.send(productos);
    } catch (error) {
        res.send(error);
    }});

    //Eliminar
    app.delete('/delete/:id', async (req, res) => {
        try {
            const id = req.params.id;
            await db.collection('productos').doc(id).delete();
            res.send('Producto eliminado');
        } catch (error) {
            res.send(error)
        }
    });

    //Actualizar
    app.put('/update/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const jsonBody = {
                nombre: req.body.nombre,
                marca: req.body.marca,
                precio: req.body.precio,
                almacenamiento: req.body.almacenamiento,
                color: req.body.color,
                foto: req.body.foto,
                tipoDispostivo: req.body.tipoDispostivo
            };
            await db.collection('productos').doc(id).update(jsonBody);
            res.send('Producto actualizado');
        } catch (error) {
            res.send(error)
        }
    });


    

app.get('/', (req, res) => {
    res.send('Hello World!')
});


app.listen(5000, () => {
    console.log(`Servidor corriendo en el puerto 5000`);
});

