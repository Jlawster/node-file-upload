const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');
var multer  = require('multer');
const { ReadStream } = require('fs-extra');
var upload = multer({ dest: 'uploads/' })
  
//'use strict';
 
var FileReader = require('filereader')
  , FileReader = new FileReader()
  ;             // Classic fs

  var finalfilename="";
  let index = 0;
  var g4c0_file;
  var g4c1_file;
  var g4c2_file;
  var g4c3_file;
  let probleme = [];
  let size = 0;
  var pos1=0;
var pos2=0;
var pos3=0;
var pos4=0;
  var i;
  var j;
  var g4c0="1000";
  var g4c1="0100";
  var g4c2="0010";
  var g4c3="0001";
  var str = "1000";
var posMatrix = 1;

String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
const app = express(); // Initialize the express web server
// app.use(fileupload());
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

const uploadPath = path.join(__dirname, 'fu/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits


/**
 * Create route /upload which handles the post request
 */


app.route('/Matrice').post((req, res, next) => {
    
    req.pipe(req.busboy); // Pipe it trough busboy
    
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);

            fs.readFile('fu/'+filename, 'utf-8',(err, data) => {
                if (err) throw err;
                console.log(data);
                data = data.split(" ").join("");
        
                for(let i = 0 ; i<data.length ; i++){
                  if (data[i] == "0"){
          
        
                    size++;
                    if(size == 1){
                      index = i;
                    }
                  }
                  if (data[i] == "1"){
        
                    size++;
                    if(size == 1){
                      index = i;
                    }
                  }
                }
                if(size!=32){
                  window.alert("matrice incorrect doit contenir 32 bits !");
                  return;
                }
                //on decoupe grace à subdata notre chaine data pour la decomposer dans quatre variable coreespondant à nos 4 octets
                g4c0_file= data.substr(index,8);
                g4c1_file= data.substr(index+8,8);
                g4c2_file= data.substr(index+16,8);
                g4c3_file= data.substr(index+24,8);
         
              for(i=0;i<g4c0.length;i++){
          
                for(j=0;j<g4c0_file.length;j++){
                    if(g4c0[i]==g4c0_file[j] &&
                       g4c1[i]==g4c1_file[j] &&
                       g4c2[i]==g4c2_file[j] &&
                       g4c3[i]==g4c3_file[j] 
                    ){
        
                          if(posMatrix==1){
                              pos1=j+1;
                          }
                      
          
                          if(posMatrix==2){
                              pos2=j+1;
                        
                          }
                          
                          if(posMatrix==3){
                              pos3=j+1;
                          }
                          
                          if(posMatrix==4){
                              pos4=j+1;
                          }
                          posMatrix++;
                          
                    }
                }
                
            }
            fs.unlink('fu/' + filename);
            console.log("1 :" +pos1 +" 2 :"+ pos2 +" 3 :"+ pos3 +" 4 :"+ pos4);
              });

            res.redirect('back');
        });
    });
});


let dataArray = new Array();
var binArray = new Array();
var allBin ="";

var decodArray = new Array();
var HexaBinary = new Array();        
var all="";
app.route('/decode').post((req, res, next) => {
    
    req.pipe(req.busboy); // Pipe it trough busboy
    
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
        console.log(busboy);
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {

            
//{ highWaterMark: (1024 * 2048)/2 }
const readStream = fs.createReadStream('fu/'+filename,{ highWaterMark: (1024 * 2048)/2 });
let output = '';
readStream.on('data', function(chunk) {
    let view = new Uint8Array(chunk);
    for(let i=0;i<view.length;i++){
    dataArray[i] = view[i].toString(16);
    
    binArray[i] = BigInt('0x' + dataArray[i]);
       binArray[i] = binArray[i].toString(2);
       if(binArray[i].length < 8){
           for(let missing0 = binArray[i].length; missing0 < 8 ; missing0 ++){

                binArray[i] = "0" + binArray[i]; 
           }
       }
       
     //  allBin +=  binArray[i];
     decodArray[i] =  binArray[i].charAt(pos1-1) + binArray[i].charAt(pos2-1) + binArray[i].charAt(pos3-1) + binArray[i].charAt(pos4-1);

     all +=  parseInt(decodArray[i], 2).toString(16);
    }

    Convert();
        function clean_hex(input) {
            input = input.toUpperCase();
               
            var orig_input = input;
            input = input.replace(/[^A-Fa-f0-9]/g, "");
            if (orig_input != input)
                alert ("Erreur.");
            return input;    
        } 
        
        function Convert() {
          var cleaned_hex = clean_hex(all);	  
          var binary = new Array();
          for (var i=0; i<cleaned_hex.length/2; i++) {
            var h = cleaned_hex.substr(i*2, 2);
            binary[i] = parseInt(h,16);        
          }
          var byteArray = new Uint8Array(binary);
          chunk = Buffer.from(byteArray);

        

        }

        fs.open('fu/'+ filename.substring(0,filename.length-1),"w", function(err,fd){
            fs.write(fd,chunk);
            fs.close(fd);
        });
        
});

readStream.on('end', function() {
  console.log('finished reading');
  res.redirect('/dl');
  finalfilename = 'fu/' + filename.substring(0,filename.length-1);
//   var buf = Buffer.from(output);
//   fs.writeFile('fu/' + filename.substring(0,filename.length-1),buf);
//   output='';
//   console.log('out' + output);
  // write to file here.
});
            // fs.readFile('fu/'+filename,  (err, data) => {
            
            //   });

            console.log(`Upload of '${filename}' finished`);
            
        });
    });
});


var binEncodeArrayTmp = new Array();
var binEncodeArray = new Array();
var HexaBinaryEncode ="";
app.route('/encode').post((req, res, next) => {
    
    req.pipe(req.busboy); // Pipe it trough busboy
    
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);
        console.log(busboy);
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {

            
//{ highWaterMark: (1024 * 2048)/2 }
const readStream = fs.createReadStream('fu/'+filename,{ highWaterMark: (1024 * 2048)/2 });
let output = '';
let y = 0;

readStream.on('data', function(chunk) {
    let view = new Uint8Array(chunk);
    for(let i=0;i<view.length;i++){
    dataArray[i] = view[i].toString(16);
    
    binArray[i] = BigInt('0x' + dataArray[i]);
       binArray[i] = binArray[i].toString(2);
       if(binArray[i].length < 8){
           for(let missing0 = binArray[i].length; missing0 < 8 ; missing0 ++){

                binArray[i] = "0" + binArray[i]; 
           }
       }
       allBin+=binArray[i];
    }

       for(var i=0;i<(binArray.length*2);i++){
        binEncodeArrayTmp[i]="";
        binEncodeArray[i]="11111111";
      }
      y=0;
      for(var z=0;z<allBin.length;z++){
        if(z!=0 && z%4==0){
          y++;
        }
        binEncodeArrayTmp[y]+=allBin[z];

    }
console.log(binEncodeArrayTmp[0][0]);

    for(var i=0;i<binEncodeArray.length;i++){
        binEncodeArray[i] = binEncodeArray[i].replaceAt(pos1-1, binEncodeArrayTmp[i][0]); // Should display He!!o World
        binEncodeArray[i] = binEncodeArray[i].replaceAt(pos2-1, binEncodeArrayTmp[i][1]); // Should display He!!o World
        binEncodeArray[i] = binEncodeArray[i].replaceAt(pos3-1, binEncodeArrayTmp[i][2]); // Should display He!!o World
        binEncodeArray[i] = binEncodeArray[i].replaceAt(pos4-1, binEncodeArrayTmp[i][3]);

        HexaBinaryEncode +=  parseInt(binEncodeArray[i], 2).toString(16);

      }
      

    Convert();
        function clean_hex(input) {
            input = input.toUpperCase();
               
            var orig_input = input;
            input = input.replace(/[^A-Fa-f0-9]/g, "");
            if (orig_input != input)
                alert ("Erreur.");
            return input;    
        } 
        
        function Convert() {
          var cleaned_hex = clean_hex(HexaBinaryEncode);	  
          var binary = new Array();
          for (var i=0; i<cleaned_hex.length/2; i++) {
            var h = cleaned_hex.substr(i*2, 2);
            binary[i] = parseInt(h,16);        
          }
          var byteArray = new Uint8Array(binary);
          chunk = Buffer.from(byteArray);
        

        }

        fs.open('fu/'+ filename + 'c',"w", function(err,fd){
            fs.write(fd,chunk);
            fs.close(fd);
        });
        
});

readStream.on('end', function() {
  console.log('finished reading');
  res.redirect('/dl');
  finalfilename = 'fu/' + filename + 'c';
//   var buf = Buffer.from(output);
//   fs.writeFile('fu/' + filename.substring(0,filename.length-1),buf);
//   output='';
//   console.log('out' + output);
  // write to file here.
});
            // fs.readFile('fu/'+filename,  (err, data) => {
            
            //   });

            console.log(`Upload of '${filename}' finished`);
            
        });
    });
});

app.get('/dl', (req, res) => {
    console.log(finalfilename);
    res.download(finalfilename);
  });
/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>MATRICE</h1>');
    res.write('<form action="Matrice" method="post" enctype="multipart/form-data">');
    res.write('<input id = "file-input" type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.write('<br>');
    res.write('<h1>DECODE</h1>');
    res.write('<form action="decode" method="post" enctype="multipart/form-data">');
    res.write('<input id = "file-input" type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.write('<br>');
    res.write('<h1>ENCODE</h1>');
    res.write('<form action="encode" method="post" enctype="multipart/form-data">');
    res.write('<input id = "file-input" type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});



const server = app.listen(3200, function () {
    console.log(`Listening on port ${server.address().port}`);

    
});