import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../Firebase/Firebase';
import $ from "jquery";
function Search() {
    const [hospitalId, fetchHospitalId] = useState([])
    const [category, setCategory] = useState("")
    const [searchValueKey, setSearchValueKey] = useState("")
    const [idForOnchangeDepartment, setidForOnchangeDepartment] = useState("")
    const [retrieveHospitalDetails, setRetrieveHospitalDetails] = useState([])
    const [hospitalDetails, setHospitalDetails] = useState([]);
    const [radiologyDetails, setradiologyDetails] = useState([])
    const [radiologyIdDetails, setradiologyIdDetails] = useState([])

    const [itemDetails, setItemDetails] = useState({
        detailValues: [{
            val1: "",
            val2: "",
            val3: "",
            val4: ""
        }]
    });
    const fetchDBValues = (e) => {
        const selectedLocation = e.target.value + "";
        setHospitalDetails([])
        fetchHospitalId([])
        setRetrieveHospitalDetails([])
        console.log("@@@@")
        document.getElementById("itemSearch1").value = "";
        document.getElementById("itemSearch2").value = "";
        $('#categoryId').val('empty');
        firebase.database().ref("/enroll").once("value", items => {
            console.log(items)
            items.forEach(item => {
                console.log(item)
                let locationDB = item.val().Address + ""
                if (locationDB.toLowerCase().includes(selectedLocation.toLowerCase())) {
                    fetchHospitalId(hospitalId => [...hospitalId, item.val().Id])
                    setHospitalDetails(hospitalDetails => hospitalDetails.concat(item.val()));
                }

            })

        })
    }

    const createInputs = () => {
        return itemDetails.detailValues.map((skill, idx) => {
            return (
                <tr key={idx}>
                    <td>
                        {skill.val1}
                    </td>
                    <td>
                        {skill.val2}
                    </td>
                    <td>
                        {skill.val3}
                    </td>
                    <td>
                        {skill.val4}
                    </td>
                </tr>
            );
        });
    };
    const fetchHospitalServices = (e) => {
        
        if (e.target.value == "") {
            document.getElementById("bodyVal").style.display = "block"
            setRetrieveHospitalDetails(retrieveHospitalDetails =>
                retrieveHospitalDetails.concat(hospitalDetails.filter(obj => {
                    return obj
                }))
            )
            }
        else {
            document.getElementById("bodyVal").style.display = "block"
            setRetrieveHospitalDetails([])
            let itemValue = e.target.value + "";
            setRetrieveHospitalDetails(retrieveHospitalDetails =>
                retrieveHospitalDetails.concat(hospitalDetails.filter(obj => {
                    return obj.HospitalName.toLowerCase().includes(itemValue.toLowerCase())
                }))
            )
        }
    }

    const fetchCategory = (e) => {
        setCategory(e.target.value);
        if (e.target.value == 'Radiology' || e.target.value == 'Diagnostics'
            || e.target.value == 'Doctors') {
            document.getElementById("bodyVal").style.display = "none"
            setRetrieveHospitalDetails([])
            document.getElementById("itemSearch1").style.display = "none"
            document.getElementById("itemSearch2").style.display = "block"
            document.getElementById("itemSearch1").value = "";
            document.getElementById("itemSearch2").value = "";
        }
        else if (e.target.value == 'Hospitals') {
            document.getElementById("bodyVal").style.display = "block"
            document.getElementById("itemSearch2").style.display = "none"
            document.getElementById("itemSearch1").style.display = "block"
            document.getElementById("itemSearch1").value = "";
            document.getElementById("itemSearch2").value = "";
            setRetrieveHospitalDetails(retrieveHospitalDetails =>
                retrieveHospitalDetails.concat(hospitalDetails.filter(obj => {
                    return obj
                }))
            )
        }
        else {
            alert("choose some category")
        }
    }

    const findDetailsForRadiology = (e) => {
        console.log("inside radiology")
        setSearchValueKey(e.target.value);
        console.log(e.target.value)
        console.log(searchValueKey)
        if (!e.target.value) {
            document.getElementById("bodyVal").style.display = "none"
        }
        else {
            document.getElementById("bodyVal").style.display = "block"
            let tempVal = "";
            if (category == 'Radiology') {
                tempVal = "radiologyDetails"
            }
            else if (category == 'Diagnostics') {
                tempVal = "diagnosticsDetails"
            }
            else if (category == 'Doctors') {
                tempVal = "departmentDetails"
            }
            setradiologyDetails([]);
            setradiologyIdDetails([])
            let searchValue = e.target.value + "";
            if (tempVal == "departmentDetails") {
                hospitalId.forEach(arrayValue => {
                    
                    firebase.database().ref(tempVal).child(arrayValue).once("value", itemss => {
                        itemss.forEach(items => {
                            items.forEach(item => {
                                setradiologyDetails(item.val().filter(obj => {
                                    var accept = obj.val1.toLowerCase().includes(searchValue.toLowerCase())
                                    if (accept) {
                                        setradiologyIdDetails(radiologyIdDetails => {
                                            return radiologyIdDetails.concat(arrayValue)
                                        })

                                        return accept
                                    }
                                }))

                            })

                        })
                    })
                })
            }
            else {
                hospitalId.forEach(arrayValue => {
                    console.log(arrayValue)
                    
                    firebase.database().ref(tempVal).child(arrayValue).once("value", items => {
                        items.forEach(item => {
                            setradiologyDetails(item.val().filter(obj => {
                                var accept = obj.val1.toLowerCase().includes(searchValue.toLowerCase())
                                if (accept) {
                                    setradiologyIdDetails(radiologyIdDetails => {
                                        return radiologyIdDetails.concat(arrayValue)
                                    })

                                    return accept
                                }
                            }))
                        })
                    })
                })
            }
        }

    }

    const detailsOfDepartment = (value) => {
        $('#departmentOptions').empty().append('<option selected="selected" value="CHOOSE">Chose the service</option>');
        setItemDetails({
            detailValues: [{
                val1: "",
                val2: "",
                val3: "",
                val4: ""
            }]
        })
        setidForOnchangeDepartment(value)
        firebase.database().ref("/departmentDetails").once('value', items => {

            items.forEach(item => {
                if (item.key === value) {
                    item.forEach(x => {
                        var option = $("<option />");
                        option.html(x.key);
                        option.val(x.key);
                        $("#departmentOptions").append(option);
                    })

                }
            })
        })
    }
    const detailsOfLab = (value, fetchKey, e) => {
        console.log("debug1")
        
        console.log(searchValueKey)
        setItemDetails({
            detailValues: [{
                val1: "",
                val2: "",
                val3: "",
                val4: ""
            }]
        })

        if (fetchKey === 'departmentDetails') {
            firebase.database().ref(fetchKey).child(value).child(e.target.value).once('value', items => {
                items.forEach(item => {
                    setItemDetails(() => {
                        return { detailValues: item.val().filter(obj => obj.val1 != "") }
                    })
                })
            })
        }
        else {
            console.log("debug2")
            firebase.database().ref(fetchKey).child(value).once('value', items => {
                items.forEach(item => {
                    if (item.hasChildren()) {
                        setItemDetails(() => {
                            item.val().filter(obj=>{
                                console.log(obj.val1)
                            })
                            return { 
                                
                                detailValues: item.val().filter(obj => obj.val1.toLowerCase().indexOf(searchValueKey.toLowerCase())!=-1) 
                            
                            }
                        })
                    }
                })
            })
        }
    }

    const createHospitalCard = () => {

        if (retrieveHospitalDetails.length == 0) {
            return hospitalDetails.map((item, index) => {
                index = index + category
                if (radiologyIdDetails.includes(item.Id)) {
                    return (

                        <div key={index}>
                            
                            {
                            
                            category=="Radiology"?
                            <div className="container toggleContainer" style={{ backgroundColor: "#2a6792" }}
                            key={index}>
                            <ul className="nav nav-tabs" role="tablist" >
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#home" + index}>Hospital Details</a>
                            </li>
                            <li className="nav-item active">
                                    <a className="nav-link active" data-toggle="tab" href={"#radio" + index}>Radiology</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href={"#lab" + index}>Diagnostics</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href={"#service" + index}>Services</a>
                            </li>
                            </ul>
                            <div className="tab-content">
                            <div id={"home" + index} className="container tab-pane fade">
                                <h3 style={{ color: "yellow" }}>{item.HospitalName}</h3>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Address},{item.Pincode}</p>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Email}</p>
                            </div>
                            <div id={"radio" + index} className="container tab-pane active">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#radiology"
                                    onClick={() => { detailsOfLab(item.Id, "radiologyDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Scan Details</h4></div>

                            </div>
                            <div id={"lab" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#diagnostics"
                                    onClick={() => { detailsOfLab(item.Id, "diagnosticsDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Lab Details</h4></div>


                            </div>
                            <div id={"service" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#department"
                                    onClick={() => { detailsOfDepartment(item.Id) }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Department/Services Details</h4></div>

                            </div>
                        </div>
                        </div>
                                :
                            category=="Diagnostics"?
                            <div className="container toggleContainer" style={{ backgroundColor: "#2a6792" }}
                            key={index}>
                            <ul className="nav nav-tabs" role="tablist" >
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#home" + index}>Hospital Details</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#radio" + index}>Radiology</a>
                            </li>
                            <li className="nav-item active">
                                    <a className="nav-link active" data-toggle="tab" href={"#lab" + index}>Diagnostics</a>
                            </li>
                            <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href={"#service" + index}>Services</a>
                            </li>
                            </ul>
                            <div className="tab-content">
                            <div id={"home" + index} className="container tab-pane fade">
                                <h3 style={{ color: "yellow" }}>{item.HospitalName}</h3>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Address},{item.Pincode}</p>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Email}</p>
                            </div>
                            <div id={"radio" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#radiology"
                                    onClick={() => { detailsOfLab(item.Id, "radiologyDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Scan Details</h4></div>

                            </div>
                            <div id={"lab" + index} className="container tab-pane active">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#diagnostics"
                                    onClick={() => { detailsOfLab(item.Id, "diagnosticsDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Lab Details</h4></div>


                            </div>
                            <div id={"service" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#department"
                                    onClick={() => { detailsOfDepartment(item.Id) }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Department/Services Details</h4></div>

                            </div>
                        </div>
                        </div>
                            :
                            category=="Doctors"?
                            <div className="container toggleContainer" style={{ backgroundColor: "#2a6792" }}
                            key={index}>
                            <ul className="nav nav-tabs" role="tablist" >
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#home" + index}>Hospital Details</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#radio" + index}>Radiology</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#lab" + index}>Diagnostics</a>
                            </li>
                            <li className="nav-item active">
                                    <a className="nav-link active" data-toggle="tab" href={"#service" + index}>Services</a>
                            </li>
                            </ul>
                            <div className="tab-content">
                            <div id={"home" + index} className="container tab-pane fade">
                                <h3 style={{ color: "yellow" }}>{item.HospitalName}</h3>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Address},{item.Pincode}</p>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Email}</p>
                            </div>
                            <div id={"radio" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#radiology"
                                    onClick={() => { detailsOfLab(item.Id, "radiologyDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Scan Details</h4></div>

                            </div>
                            <div id={"lab" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#diagnostics"
                                    onClick={() => { detailsOfLab(item.Id, "diagnosticsDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Lab Details</h4></div>


                            </div>
                            <div id={"service" + index} className="container tab-pane active">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#department"
                                    onClick={() => { detailsOfDepartment(item.Id) }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Department/Services Details</h4></div>

                            </div>
                        </div>
                        </div>
                            :
                            <div className="container toggleContainer" style={{ backgroundColor: "#2a6792" }}
                            key={index}>
                            <ul className="nav nav-tabs" role="tablist" >
                            <li className="nav-item active">
                                    <a className="nav-link active" data-toggle="tab" href={"#home" + index}>Hospital Details</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#radio" + index}>Radiology</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#lab" + index}>Diagnostics</a>
                            </li>
                            <li className="nav-item ">
                                    <a className="nav-link " data-toggle="tab" href={"#service" + index}>Services</a>
                            </li>
                            </ul>
                            <div className="tab-content">
                            <div id={"home" + index} className="container tab-pane active">
                                <h3 style={{ color: "yellow" }}>{item.HospitalName}</h3>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Address},{item.Pincode}</p>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Email}</p>
                            </div>
                            <div id={"radio" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#radiology"
                                    onClick={() => { detailsOfLab(item.Id, "radiologyDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Scan Details</h4></div>

                            </div>
                            <div id={"lab" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#diagnostics"
                                    onClick={() => { detailsOfLab(item.Id, "diagnosticsDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Lab Details</h4></div>


                            </div>
                            <div id={"service" + index} className="container tab-pane active">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#department"
                                    onClick={() => { detailsOfDepartment(item.Id) }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Department/Services Details</h4></div>

                            </div>
                        </div>
                        </div>
                            }



                            
                        </div>

                    )
                }
            })
        }
        else {
            return retrieveHospitalDetails.map((item, index) => {
                return (
                    <div className="container toggleContainer" style={{ backgroundColor: "#2a6792" }}
                        key={index}>
                        <ul className="nav nav-tabs" role="tablist" >
                            <li className="nav-item active">
                                <a className="nav-link active" data-toggle="tab" href={"#home" + index}>Hospital Details</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href={"#radio" + index}>Radiology</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href={"#lab" + index}>Diagnostics</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href={"#service" + index}>Services</a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div id={"home" + index} className="container tab-pane active">
                                <h3 style={{ color: "yellow" }}>{item.HospitalName}</h3>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Address},{item.Pincode}</p>
                                <p style={{ color: "white", fontStyle: "italic" }}>{item.Email}</p>
                            </div>
                            <div id={"radio" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#radiology"
                                    onClick={() => { detailsOfLab(item.Id, "radiologyDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Scan Details</h4></div>

                            </div>
                            <div id={"lab" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#diagnostics"
                                    onClick={() => { detailsOfLab(item.Id, "diagnosticsDetails", "") }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Lab Details</h4></div>


                            </div>
                            <div id={"service" + index} className="container tab-pane fade">
                                <h4 style={{ color: "yellow", textDecoration: "none" }}>{item.HospitalName}</h4>
                                <div
                                    data-toggle="modal" data-target="#department"
                                    onClick={() => { detailsOfDepartment(item.Id) }} style={{ cursor: "pointer", textDecoration: "underline", color: "white", fontStyle: "italic" }}><h4>Department/Services Details</h4></div>

                            </div>
                        </div>
                    </div>
                )
            })
        }
    }
    return (
        <div className="overview" style={{ display: "block" }}>
            <div className="modal fade bd-example-modal-lg" id="radiology" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Scan information</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div>
                                    <table style={{ width: "100%", border: "border:1px solid #EEEEEE" }}>
                                        <thead className="table-header">
                                            <tr>
                                                <th>Scan Name</th>
                                                <th>Price</th>
                                                <th>Prerequsite/Timings</th>
                                                <th>Report Availability</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {createInputs()}
                                        </tbody>
                                    </table>
                                </div><br />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="modal fade bd-example-modal-lg" id="diagnostics" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Lab information</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div>
                                    <table style={{ width: "100%", border: "border:1px solid #EEEEEE" }}>
                                        <thead className="table-header">
                                            <tr>
                                                <th>Diagnostic Name</th>
                                                <th>Price</th>
                                                <th>Prerequsite/Timings</th>
                                                <th>Report Availability</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {createInputs()}
                                        </tbody>
                                    </table>
                                </div><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade bd-example-modal-lg" id="department" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLabel">Department Details</h3>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="custom-select" style={{ width: "200px", display: "inline-block", margin: "5px" }}>
                                    <select id="departmentOptions"
                                        onChange={e => detailsOfLab(idForOnchangeDepartment, "departmentDetails", e)}>
                                    </select>
                                </div>
                                
                                <div>
                                    <table style={{ width: "100%", border: "border:1px solid #EEEEEE" }}>
                                        <thead className="table-header">
                                            <tr>
                                                <th>Doctor Name</th>
                                                <th>Qualification/Experience</th>
                                                <th>Timings</th>
                                                <th>Fees</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {createInputs()}
                                        </tbody>
                                    </table>
                                </div><br />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="header">
                <span style={{ fontSize: "30px" }}>Customer Search</span>
            </div>
            <div className="input-group" style={{ display: "flex" }}>

                <div className="custom-select" style={{ width: "200px", display: "inline-block", padding: "10px" }}>
                    <select
                        onChange={e => fetchDBValues(e)}>
                        <option value="empty">Location</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Erode">Erode</option>
                    </select>
                </div>
                <div className="custom-select"  style={{ width: "200px", display: "inline-block", padding: "10px" }}>
                    <select id="categoryId"
                        onChange={e => fetchCategory(e)}>
                        <option value="empty">Category</option>
                        <option value="Hospitals">Hospitals and Clinics</option>
                        <option value="Diagnostics">Diagnostics (Lab Test)</option>
                        <option value="Radiology">Radiology (Scan)</option>
                        <option value="Doctors">Doctors</option>
                    </select>
                </div><br></br>
                <input type="text" id="itemSearch1" className="form-control" style={{
                    display: "none", padding: "30px", color: "#326892", fontSize: "large", fontFamily: "sans-serif",
                    border: "2px solid #52ab6e !important"
                }} placeholder="Search for clinics/hospitals"
                    onChange={e => fetchHospitalServices(e)}
                />
                <input type="text" id="itemSearch2" className="form-control" style={{
                    display: "none", padding: "30px",  color: "#326892", fontSize: "large", fontFamily: "sans-serif",
                    border: "2px solid #52ab6e !important"
                }} placeholder={"Search for " + category}
                    onChange={e => findDetailsForRadiology(e)}
                />
                <br></br>

            </div>
            <div id="bodyVal">
                {createHospitalCard()}</div>
            <Link to="/enroll"><button className="button button2">Hospital Enrollment</button></Link>
            <Link to="/hospitalLogin"><button className="button button3">Hospital Login</button></Link>
        </div>
    )
}
export default Search;