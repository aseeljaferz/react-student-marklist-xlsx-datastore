const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const xlsx = require('xlsx');
const { rejects } = require('assert');
const { log } = require('console');

app.use(cors());
app.use(express.json());

const excelPath='/Users/aseeljafer/Documents/full_Stack/ReactJS/xlsheetdatastoreage/marklist.xlsx'

//load existing list
async function loadStudentData(){

        if(fs.existsSync(excelPath)){
            const workbook = xlsx.readFile(excelPath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet);``
            return data;
        }else{
            console.log("No filee")
            return [];
        }
    
}

//save data to xl sheet

async function  saveStudentData(data){
    console.log(data)
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet,'students');
        await xlsx.writeFile(workbook,excelPath)

}
// app.use(express.static('public'));

app.get('/api/students', async(req,res)=>{
    try{
        const students = await loadStudentData();
        res.json(students);
    }catch(error){
        console.error('Error adding student:', error);
        res.status(500).json({error:'Internal server error'});
    }
});

app.post('/api/addStudent', async(req, res)=>{
    try{
        const newStudent = req.body;
        console.log(req.body.marks)
        const students = await loadStudentData();
        students.push(newStudent);
        await saveStudentData(students);
        res.json(students);
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'});
    }
})
let port;
app.listen(port = 8000,()=>{
    console.log(`Server is running on ${port}`);
})