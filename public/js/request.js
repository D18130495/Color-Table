// get colour list
function getColourList() {
    return axios.get("/colours");
}

// get colour by colour Id
function getColourByColourId(colourId) {
    return axios.get("/colours/" + colourId);
}

// create a new colour
function createColour(colourData) {
    return  axios({
        method: 'post',
        url:'/colours/',
        data: colourData
    });
}

// update colour by colour Id
function updateColourByColourId(colourId, colourData) {
    return axios({
        method: 'put',
        url:'/colours/' + colourId,
        data: colourData
    });
}

// delete colour by colour Id
function deleteColourByColourId(colourId) {
    return axios.delete("/colours/" + colourId);
}

// bad request
// update colour with out colour Id
function updateColourWithoutColourId() {
    return axios.put("/colours");
}

// bad request
// delete colour without colour Id
function deleteColourWithoutColourId() {
    return axios.delete("/colours");
}

// axios response interceptor
axios.interceptors.response.use(
    response => {
        if(response.status === 200) {
            if(response.data.status !== 200) {
                ELEMENT.Message.error({
                    message: response.data.message,
                    showClose: true,
                    duration: 1500
                });

                return Promise.reject(response);
            }else {
                return Promise.resolve(response);
            }
        }else {
            ELEMENT.Message.error({
                message: "Request not successful",
                showClose: true,
                duration: 1500
            });

            return Promise.reject(response);
        }
    },
    error => {
        ELEMENT.Message.error({
            message: "Oops! Something goes wrong",
            showClose: true,
            duration: 1500
        });

        return Promise.reject(error.response);
    }
)