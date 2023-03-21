var express = require('express');
const mysql = require('mysql')
const bodyParser = require('body-parser');
var bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
app.use(function(req,res,next){
    //Access-Control-Allow-Origin
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accep,x-client-key,x-client-token,x-client-secret,Authorization")
    next()
})

const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistemadeformularios'
});

mc.connect();

//Agregar un usuario
app.post('/usuario',function(req,res){
    let datosUsuario={
        rut:req.body.rut,
        nombre:req.body.nombre,
        correo:req.body.correo,
        password:bcrypt.hashSync(req.body.password,10),
        rol:req.body.rol,
        sexo:req.body.sexo,
        carrera:req.body.carrera
    };
    if(mc){
        mc.query("INSERT INTO usuario SET ?",datosUsuario,function(error,result){
            if(error){
                return res.status(400).json({
                    ok:false,mensaje:'Error a crear usuario',error:error
                })
            }else{
                res.status(201).json({
                    ok:true,usuario:result
                })
            }
        });
    }
});

app.post('/login',function(req,res){
    var body=req.body;
    console.log(body);
    mc.query("SELECT * FROM usuario WHERE correo = ?",body.correo,function(error,results,fields){
        if(error){
            return res.status(500).json({
                ok:false,
                mensaje:'Error al busca usuario',
                errors:error
            });
        }
        if(!results.length){
            return res.status(400).json({
                ok:false,
                mensaje:'Credenciales incorrectas',
                errors:error
            });
        }
        console.log(results);
        if(!bcrypt.compareSync(body.clave,results[0].password)){
            return res.status(400).json({
                ok:false,mensaje:'Credenciales Incorrectas',errors:error
            });
        }
        //Crear TOKEN
        let seed='Formularios'
        let token=jwt.sign({usuario:results[0].clave},seed,{expiresIn:14400});
        res.status(200).json({
            ok:true,
            usuario:results,
            id:results[0].rut,
            token:token
        });
    });
});



//Agregar Formulario
app.post('/ingresarformulario',function(req,res){
    let datosFormulario = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        url: req.body.url,
        tipo_formulario: req.body.tipo_formulario,
        subtipo_formulario:req.body.subtipo_formulario,
        estado:req.body.estado,
        sexo_dirigido:req.body.sexo_dirigido,
        carrera_dirigida:req.body.carrera_dirigida,
        fecha_vencimiento:req.body.fecha_vencimiento,
        id_usuario:req.body.id_usuario
    };
    console.log(datosFormulario);
    if(mc){
        mc.query('INSERT INTO formulario SET ?', datosFormulario, function(error, result){
            if(error){
                res.status(500).json({"Mensaje":"ERROR"});
            }else{
                res.status(201).json({"Mensaje":"INSERTADO"})
            }
        });
    }
});

app.post('/respuesta',function(req,res){
    let datos = {
        id_usuario: req.body.id_usuario,
        id_formulario: req.body.id_formulario,
    };
    if(mc){
        mc.query('INSERT INTO respuesta SET ?', datos, function(error, result){
            if(error){
                res.status(500).json({"Mensaje":"ERROR"});
            }else{
                res.status(201).json({"Mensaje":"INSERTADO"})
            }
        });
    }
});


//Actualizar Estado Formulario
app.put('/formulario',function(req,res){
    let id=req.body.id;
    let estado=req.body.estado;
    if(!id || !estado){
        return res.status(400).send({error:id, message:'El error esta en el id del formulario'});
    }
    mc.query("UPDATE formulario SET estado=? WHERE id = ?",[estado,id],function(error,results,fields){
        if(error) throw error;
        return res.status(200).json({"Mensaje":"Formulario con id= "+id + "Se cambio al estado "+ estado});
    })
});

//Actualizar Formulario
app.put('/actualizarFormulario/:id',function(req,res){
    let id=req.params.id;
    let formulario=req.body;
    console.log(id);
    console.log(formulario);
    if(!id || !formulario){
        return res.status(400).send({error:id, message:'El error esta en el id del formulario'});
    }
    mc.query('UPDATE formulario SET ? WHERE Id = ?',[formulario,id],function(error,results,fields){
        if(error) throw error;
        return res.status(200).json({"Mensaje":"Formulario con id= "+id + "se modifico"});
    })
});

//Obtener formularios
app.post('/formularios', function (req, res){
    let carrera=req.body.carrera;
    let sexo=req.body.sexo;
    let id_usuario=req.body.id_usuario;
    mc.query('SELECT * FROM formulario WHERE (carrera_dirigida="Todas" or carrera_dirigida=?) and (sexo_dirigido=? or sexo_dirigido="Todos") and (CURRENT_DATE()<fecha_vencimiento) and estado="DISPONIBLE" and id NOT IN (SELECT id_formulario FROM respuesta WHERE id_usuario=?)',[carrera,sexo,id_usuario] ,function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de formularios.'
        });
    });
});

//Obtener encuestas
app.post('/encuestas', function (req, res){
    let carrera=req.body.carrera;
    let sexo=req.body.sexo;
    let id_usuario=req.body.id_usuario;
    mc.query('SELECT * FROM formulario WHERE (carrera_dirigida="Todas" or carrera_dirigida=?) and (sexo_dirigido=? or sexo_dirigido="Todos") and (CURRENT_DATE()<fecha_vencimiento) and estado="DISPONIBLE" and tipo_formulario="Encuesta" and id NOT IN (SELECT id_formulario FROM respuesta WHERE id_usuario=?)',[carrera,sexo,id_usuario], function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de encuestas.'
        });
    });
});

//Obtener actividades
app.post('/actividades', function (req, res){
    let carrera=req.body.carrera;
    let sexo=req.body.sexo;
    let id_usuario=req.body.id_usuario;
    mc.query('SELECT * FROM formulario WHERE (carrera_dirigida="Todas" or carrera_dirigida=?) and (sexo_dirigido=? or sexo_dirigido="Todos") and (CURRENT_DATE()<fecha_vencimiento) and estado="DISPONIBLE" and tipo_formulario="Actividad" and id NOT IN (SELECT id_formulario FROM respuesta WHERE id_usuario=?) ',[carrera,sexo,id_usuario], function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de actividades.'
        });
    });
});

//Obtener misFormularios
app.get('/misFormularios/:id', function (req, res){
    let id=req.params.id;
    mc.query('select * from formulario where id_usuario=?',id,function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de misFormularios.'
        });
    });
});
//Obtener formularios
app.post('/misFormulariosContestados', function (req, res){
    let carrera=req.body.carrera;
    let sexo=req.body.sexo;
    let id_usuario=req.body.id_usuario;
    mc.query('SELECT * FROM formulario WHERE (carrera_dirigida="Todas" or carrera_dirigida=?) and (sexo_dirigido=? or sexo_dirigido="Todos") and estado="DISPONIBLE" and id IN (SELECT id_formulario FROM respuesta WHERE id_usuario=?)',[carrera,sexo,id_usuario] ,function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de formularios.'
        });
    });
});

//Obtener formulario
app.get('/formulario/:id', function (req, res){
    let id=req.params.id;
    mc.query('select* from formulario where estado="DISPONIBLE" AND id=?',id, function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de formularios.'
        });
    });
});

//Obtener gestiones
app.get('/encuestas', function (req, res){
    mc.query('select* from formulario where tipo_formulario="Encuesta"', function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de gestiones.'
        });
    });
});

//Obtener gestiones
app.get('/actividades', function (req, res){
    mc.query('select * from formulario where tipo_formulario="Actividad"', function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de gestiones.'
        });
    });
});

//Obtener gestiones
app.get('/respuestas', function (req, res){
    mc.query('select * from respuesta', function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de gestiones.'
        });
    });
});


//Obtener usuarios
app.get('/usuario/:id', function (req, res){
    let id=req.params.id
    mc.query('select * from usuario where id=?',id, function (err, results, fields) {
        if (err) throw error;
        return res.send({
            error:false,
            data: results,
            massage: 'Lista de usuarios.'
        });
    });
});



//Eliminar Login
app.delete('/login/:id', function(req,res){
    let id=req.params.id;
    if(mc){
        mc.query("DELETE FROM login WHERE id = ?", id, function(error,result){
            if(error){
                return res.status(500).json({"Mensaje":"Error"});
            }else{
                return res.status(200).json({"Mensaje":"Login con id " + id + " borrado" });
            }
        });
    }
});

//Eliminar formulario
app.delete('/formulario/:id', function(req,res){
    let id=req.params.id;

    if(mc){
        mc.query("DELETE FROM formulario WHERE id = ?", id, function(error,result){
            if(error){
                return res.status(500).json({"Mensaje":"Error"});
            }else{
                return res.status(200).json({"Mensaje":"Formulario con id " + id + " borrado" });
            }
        });
    }
});

//Eliminar dirigido
app.delete('/dirigido/:IdFormulario', function(req,res){
    let IdFormulario=req.params.IdFormulario;

    if(mc){
        mc.query("DELETE FROM dirigido WHERE IdFormulario = ?", IdFormulario, function(error,result){
            if(error){
                return res.status(500).json({"Mensaje":"Error a "+error+" "+IdFormulario});
            }else{
                return res.status(200).json({"Mensaje":"Dirigido con id " + IdFormulario + " borrado" });
            }
        });
    }
});



app.listen(5000, ()=>{
    console.log('Express Server - puerto 5000 online')
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    })
})
