

(window.onload = function () {
    
    var errorM = document.getElementById("error");
    //Array of listed items on the page
    var listedDrugs = [];
    document.getElementById("findDrug").addEventListener('click', findDrug);
    //Search function - 
    function findDrug() {
        errorM.innerHTML = " ";
        var api = "NQoLuUhU7S6F7R9KvMFsAnkoiX4fTXbflPPYi4ch";
        var issue = document.getElementById("issue").value;
        var limit = document.getElementById("limit").value;
        var name = document.getElementById("name").value;
        if (limit == "") {
            limit = 5;
        }
        if (issue == "") {
            issue = "pain";
        }
        //fetchDataFrom API.
        var url = "https://api.fda.gov/drug/label.json?api_key=" + api + "&search=indications_and_usage:%22treatment%22+%22relief%22+AND+purpose:%22" + issue + "%22+_exists_:(dosage_and_administration+AND+openfda.brand_name)&limit=" + limit;
        if (name != "") {
            console.log("name:" + name);
            url = "https://api.fda.gov/drug/label.json?api_key=" + api + "&search=indications_and_usage:%22treatment%22+%22relief%22+AND+purpose:%22" + issue + "%22+AND+openfda.brand_name:%22" + name + "%22+_exists_:(dosage_and_administration+AND+openfda.brand_name)&limit=" + limit;
        }
        fetch(url)
            .then(checkStatus)
            .then(function (responseText) {
                var obj = JSON.parse(responseText);
                console.log(obj);
                listFoundDrugs(obj);
            })
            .catch(function (error) {
                console.log(error);
                errorM.innerHTML = "Please try search again with different values.";
            });

    }

    //check return status
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 305) {
            return response.text();
        } else if (response.status == 410) {
            return Promise.reject(new Error(response.status));
        } else
            return Promise.reject(new Error(response.status + ":" + response.statusText));
    }
    //list the functions after they are found from the api
    function listFoundDrugs(response) {
        document.getElementById("listArea").innerHTML = "";
        listedDrugs = [];
        var results = response.results;
        var insufficent = 0;
        if (results.length >= 1) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].openfda.brand_name != undefined) {
                    var div = document.createElement('div');
                    div.classList = "listBox";
                    var pBrandName = document.createElement("p");
                    var pUse = document.createElement("p");
                    var pDosage = document.createElement("p");
                    var pWarnings = document.createElement("p");
                    var value = document.createElement('v');
                    var brandName = results[i].openfda.brand_name[0];
                    var use = results[i].purpose;
                    var dosage = results[i].dosage_and_administration;
                    var warnings = results[i].warnings;
                    console.log(results[i].openfda.substance_name);
                    var mySubDiv = div.querySelector(".value");
                    var drugObject = {
                        brandName: brandName,
                        use: use,
                        dosage: dosage,
                        warnings: warnings,
                        ingredients: results[i].openfda.substance_name,
                        value: i
                    }
                    console.log("obj");
                    console.log(drugObject);
                    value.classList = "value";
                    value.innerHTML = i;
                    listedDrugs.push(drugObject);
                    pBrandName.classList = "brandName";
                    pUse.classList = "use";
                    pDosage.classList = "dosage";
                    pWarnings.classList = "warnings";
                    div.appendChild(pBrandName);
                    div.appendChild(pUse);
                    div.appendChild(pDosage);
                    div.appendChild(pWarnings);
                    div.appendChild(value);
                    div.addEventListener('mouseover', function () {
                        var valuez = parseInt(this.childNodes[4].innerHTML);
                        if (getDrug(valuez) !== undefined) {
                            this.childNodes[2].style = "display:block";
                            this.childNodes[3].style = "display:block";
                        } else {
                            console.log(getDrug(valuez));
                        }

                    });
                    div.addEventListener('mouseout', function () {
                        var valuez = parseInt(this.childNodes[4].innerHTML);
                        if (getDrug(valuez) !== undefined) {
                            this.childNodes[2].style = "display:none";
                            this.childNodes[3].style = "display:none";
                        } else {
                            console.log(getDrug(valuez));
                        }

                    });


                    document.getElementById("listArea").appendChild(div);
                    pBrandName.innerHTML = brandName;
                    pUse.innerHTML = use;
                    pDosage.innerHTML = dosage;
                    pWarnings.innerHTML = warnings;
                    console.log(listedDrugs);
                } else {
                    console.log("skipping result, insuffiencent information");
                    i++;
                }


            }

        }
    }


 

    //returns the drugs
    function getDrug(index) {
        console.log("index" + index);
        if (listedDrugs.length > 0) {
            return listedDrugs[index];
        }
    }

   

})
