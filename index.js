import express, { request } from "express";
import {MongoClient} from 'mongodb';
import { ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();


const url="mongodb+srv://SRIHARIKISHOREK:Kishore2003@cluster0.3nhci3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
await client.connect();
console.log("MongoDB connected successfully");

app.use(express.json());
app.use(cors());
const auth = (req,res,next) => {
    try {
        const token = req.header("backend-token");
        jwt.verify(token,"Srihari");
        next();
    } catch (error) {
        res.status(401).send({message:error.message})
    }
}

app.get("/",function(req,res){
    res.status(200).send("Hello Everyone")
});
app.post("/post",express.json(),async function(req,res){
    const getPostman = req.body;
    const sendMethod = await client.db("DATA").collection("data").insertOne(getPostman);
    res.status(201).send(sendMethod);

});
app.post("/postmany",async(req,res)=>
{
    const getMany = req.body;
    const sendMethod = await client.db("DATA").collection("data").insertMany(getMany);
    res.status(201).send(sendMethod);
});
app.get("/get",auth,async(req,res)=>{
    const getMethod = await client.db("DATA").collection("data").find({}).toArray();
    res.status(200).send(getMethod);
});
app.get("/getone/:id", async function(req,res){
    const {id} = req.params;
    const getMethod = await client.db("DATA").collection("data").findOne({_id:new ObjectId(id)});
    res.status(200).send(getMethod);
})
app.put("/update/:id",async function(req,res){
    const {id} = req.params;
    const getPostman = req.body;
    const updateMethod = await client.db("DATA").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
    res.status(201).send(updateMethod);  
})
app.delete("/delete/:id",async function(req,res){
    const{id} = req.params;
    const deleteMethod = await client.db("DATA").collection("data").deleteOne({_id:new ObjectId(id)});
    res.status(200).send(deleteMethod);
})
app.post("/register",async function(req,res){
    const {username,email,password}= req.body;
    const userFind = await client.db("DATA").collection("private").findOne({email:email});
    if(userFind){
        res.status(400).send("Existing user");
    }
    else{
         
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);
         const registerMethod = await client.db("DATA").collection("private").insertOne({username:username,email:email,password:hashedPassword});
         res.status(201).send(registerMethod);

    }
})
app.post("/login",async function(req,res){
    const {email,password}=req.body;
    // console.log(email);
    // console.log(password)
    const userFind = await client.db("DATA").collection("private").findOne({email:email})
    if(userFind){
        const mongoDBpassword = userFind.password;
        const passwordCheck = await bcrypt.compare(password,mongoDBpassword);
        // console.log(passwordCheck);
         if(passwordCheck)
         {
            const token = jwt.sign({id:userFind._id},"Srihari");
            res.status(200).send({token:token});
         }
         else
         {
            res.status(400).send("Invalid password");
         }
    }
    else{
        res.status(400).send("Invalid email id")
    }
})
app.listen(4000,()=>{
    console.log("Server connected successfully")
})