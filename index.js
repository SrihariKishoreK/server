import express, { request } from "express";
import {MongoClient} from 'mongodb';
import { ObjectId } from "mongodb";
import cors from "cors";

const app = express();


const url="mongodb+srv://SRIHARIKISHOREK:Kishore2003@cluster0.3nhci3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(url);
await client.connect();
console.log("MongoDB connected successfully");

app.use(cors());
app.use(express.json());

app.get("/",function(req,res){
    res.send("Hello Everyone")
});
app.post("/post",express.json(),async function(req,res){
    const getPostman = req.body;
    const sendMethod = await client.db("DATA").collection("data").insertOne(getPostman);
    res.send(sendMethod);

});
app.post("/postmany",async(req,res)=>
{
    const getMany = req.body;
    const sendMethod = await client.db("DATA").collection("data").insertMany(getMany);
    res.send(sendMethod);
});
app.get("/get",async(req,res)=>{
    const getMethod = await client.db("DATA").collection("data").find({}).toArray();
    res.send(getMethod);
});
app.get("/getone/:id", async function(req,res){
    const {id} = req.params;
    const getMethod = await client.db("DATA").collection("data").findOne({_id:new ObjectId(id)});
    res.send(getMethod);
})
app.put("/update/:id",async function(req,res){
    const {id} = req.params;
    const getPostman = req.body;
    const updateMethod = await client.db("DATA").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
    res.send(updateMethod);  
})
app.delete("/delete/:id",async function(req,res){
    const{id} = req.params;
    const deleteMethod = await client.db("DATA").collection("data").deleteOne({_id:new ObjectId(id)});
    res.send(deleteMethod);
})
app.listen(4000,()=>{
    console.log("Server connected successfully")
})