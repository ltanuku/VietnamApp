import { Injectable } from '@angular/core';
import { LoggerServiceProvider } from '../logger-service/logger-service';
declare var WL;

/*
  Generated class for the JsonStoreProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
/* enum collectionNames{
		"user_details" ="UserDetails",	
	    "image_details" ="BannerDetails"

}
	*/

interface CollectionNames{
	userDetails : string,
	imageDetails : string

}

@Injectable()
export class JsonStoreProvider {
	public collectionNames : CollectionNames;

	constructor(public logger: LoggerServiceProvider) {
		

		this.collectionNames = {
			userDetails : "UserDetails", imageDetails : "BannerDetails"
		}

	}


	/** JSONStore initilization **/
	initilizeJsonStore(collectionName: string, collections: object) {

		let promise = new Promise((resolve, reject) => {

			try {
				WL.JSONStore.init(collections).then( (collections)=> {
					resolve(collections);
					this.logger.log("Initilize jsonStore" + collectionName + "success");
				}).fail((error)=> {
					reject(error);
					this.logger.error("Initilize jsonStore" + collectionName + "fail");
				});

			} catch (e) {
				reject(e);
				this.logger.error("Initilize jsonStore" + collectionName + "catch error:" + collectionName + "fail");
			}

		});



		return promise;
	}

	/**userdetails jsonStore init */
	initilizeJsonUserDetails() {
		let collections = {};
		collections[this.collectionNames.userDetails] = {};
		collections[this.collectionNames.userDetails].searchFields = {
			id: "string",
			token: "string",
			agentCode : "string",
		};
		let promise = new Promise((resolve, reject) => {

			this.initilizeJsonStore(this.collectionNames.userDetails, collections).then((res) => {
				resolve(res);
			}, (err) => {
				reject(err);
			});
		});
		return promise;
	}


	/** banner images JSONStore initilization **/
	initializeJsonStoreBannerImages() {
		let collections = {};
		collections[this.collectionNames.imageDetails] = {};
		collections[this.collectionNames.imageDetails].searchFields = {
			bannerImges: "string",
			userPic: "string",
			bannerImgUdate: "string",
			userPicUdate: "string"
		};
		let promise = new Promise((resolve, reject) => {
			WL.JSONStore.init(collections).then( (collections) =>{
				resolve(collections);

			}).fail( (error)=> {
				reject(error);

			});
		});
		return promise;
	}


	/***getting jsondata based on passing collection name */


	getJsonStoreData(collection) {

		try {
			let promise = new Promise((resolve, reject) => {
				WL.JSONStore.get(collection).findAll().then((res) => {
					resolve(res);
					this.logger.log("data retrieved sucess from:" + collection);
				}).fail((error) => {
					reject(error);
					this.logger.log("data retrieved failed from:" + collection);
				});
			});
			return promise;
		} catch (e) {
			this.logger.error("get jsonStore" + collection + "catch error:" + JSON.stringify(e));
		}

	}

	/** adding data to jsonStore nbased on collection name  */
	addDataToJsonStore(collection, data) {
		this.getJsonStoreData(collection).then((res: any) => {
			if (res && res.length > 0) {
				this.replaceDataInJsonstore(collection, res[0]._id, data);
			}
			else {
				WL.JSONStore.get(collection).add(data).then((res) => {
					this.logger.log("data added successfully in Json Store :" + collection);
				}, (e) => {
					this.logger.log("data added fail :" + collection);
				});
			}
		}, (error) => {
			this.logger.error("addDataToJsonStore" + collection + "catch error" + JSON.stringify(error));
		});
	}

	/** replacing  data in jsonstore based on collection name  */
	replaceDataInJsonstore(collection, id, data) {

		try {
			let options = {
				push: true
			};
			let doc = { _id: id, json: data };
			WL.JSONStore.get(collection).replace(doc, options).then( (numberOfDocumentsReplaced)=> {
				this.logger.log("data replaced successfully in:" + collection);
			},  ()=> {
				this.logger.log("data replaced fail in:" + collection);
			});
		} catch (e) {
			this.logger.error("replaceDataIn" + collection + "Jsonstore catch error:" + JSON.stringify(e));
		}
	}

	/** removing jsonStore data based on collection  */
	removeDataInJson(collection) {
		this.getJsonStoreData(collection).then((res) => {
			if (res[0]) {
				WL.JSONStore.get(collection).remove({
					_id: res[0]._id
				}, {
						push: true
					}).then( (numberOfDocsRemoved)=> {
						this.logger.log("data removed successfully in:" + collection);
					}).fail( (error)=> {
						this.logger.error("data removed failed in:" + collection);
					});
			}
		}, (err) => {
			this.logger.log("removeDataIn" + collection + " Jsonstore catch error:" + JSON.stringify(err));

		});
	}

}
