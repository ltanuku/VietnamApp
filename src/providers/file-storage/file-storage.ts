import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

import {LoggerServiceProvider} from '../logger-service/logger-service';

/*
  Generated class for the FileStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileStorageProvider {

  private  dir_Name:string  ="SUNLIFE";
  private  file_Name: string = "bannerImages.json";
  constructor(public file: File,public platform: Platform,private logger: LoggerServiceProvider) {
    
  }


  /** storage type is different for android and ios  */
  getStorageType(){

    return this.platform.is('ios')? this.file.dataDirectory : this.file.applicationStorageDirectory;
  }


  /** getting file system */
createStorageDirectory(fileName):Promise<any>{

 
  return new Promise((resolve, reject) => {
      try{
           this.file.resolveLocalFilesystemUrl(fileName).then((fileSystem)=>{
                  resolve(fileSystem);
                                    
                  },(err)=>{
                      reject(err);
                  });

          }catch(err){
            reject(err);
            this.logger.error("createStorageDirectory catch error"+JSON.stringify(err));
          } 
             

    });
  
 }
 /** creating folder if it not exists and getting filepath entery */
 createDirectoryNotExists(fileSystem):Promise<any>{
  return new Promise((resolve, reject) => {
    try{
      fileSystem.getDirectory(this.dir_Name,{create:true},(dirEntry)=>{
                resolve(dirEntry);
                              
                  },(err)=>{
                    reject(err);
                });

        }catch(err){
          reject(err);
          this.logger.error("createDirectoryNotExists catch error"+JSON.stringify(err));
         } 
           

   });
 }


 /** creating folder if it not exists and getting filepath entery */
 createFileNotExists(dirEntry):Promise<any>{
  return new Promise((resolve, reject) => {
    try{
      dirEntry.getFile(this.file_Name,{create:true},(fileEntry)=>{
                resolve(fileEntry);
                              
                  },(err)=>{
                    reject(err);
                });

        }catch(err){
          reject(err);
          this.logger.error("createFileNotExists catch error"+JSON.stringify(err));
          
        } 
           

   });
 }




/** reading data from file  */
readFileFromDirectory(path):Promise<any>{
  
  
    return new Promise((resolve, reject) => {
      try{
           path.file((file)=> {
                resolve(file);
             },(err)=>{
            reject(err)

          });
  
          }catch(err){
            reject(err);
            this.logger.error("readFileFromDirectory catch error"+JSON.stringify(err));
         
          } 
             
  
     });
  
    
       
      }


}