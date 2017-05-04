angular.module('Happystry.services').service('commonService', function () {

    var objInfo1;
    var objInfo2;
    var info1;
    var info2;
    var delinfo;
    var postImgMB;
    var postImgCount;

    return {
        getInfoObjFiles: getInfoObjFiles,
        getInfoObjSrc: getInfoObjSrc,
        setInfoObjFiles: setInfoObjFiles,
        setInfoObjSrc: setInfoObjSrc,
        getInfoFiles: getInfoFiles,
        getInfoSrc: getInfoSrc,
        setInfoFiles: setInfoFiles,
        setInfoSrc: setInfoSrc,
        emtInfoFiles: emtInfoFiles,
        emtInfoSrc: emtInfoSrc,
        emtInfoObjFiles: emtInfoObjFiles,
        setdeleteImgs: setdeleteImgs,
        getdeleteImgs: getdeleteImgs,
        emtdelImgs: emtdelImgs,
        setPostImageSize: setPostImageSize,
        getPostImageSize: getPostImageSize,
    };

    // .................

    function setdeleteImgs(value) {
        deleteimgs.push(value);
        delinfo = deleteimgs;
    }
    function getdeleteImgs() {
        return delinfo;
    }

    function emtdelImgs(value) {
        deleteimgs = [];
        delinfo = [];
        value = [];
        return delinfo;
    }

    function getInfoObjFiles() {
        return objInfo1;
    }
    function getInfoObjSrc() {
        return objInfo2;
    }
    function emtInfoSrc() {
        return objInfo1;
    }
    function emtInfoFiles(value) {
        objvalues = [];
        filevalues = [];
        value = [];
        objInfo1 = [];
        objInfo2 = [];
        info1 = [];
        info2 = [];
        return objInfo2;
    }

    function emtInfoObjFiles(value) {
        objvalues = [];
        filevalues = [];
        value = [];
        objInfo1 = [];
        objInfo2 = [];
        info1 = [];
        info2 = [];
        return objInfo1;
    }

    function setInfoObjFiles(value) {
        objInfo1 = value;
    }
    function setInfoObjSrc(value) {
        objInfo2 = value;
    }

    function getInfoFiles() {
        return info1;
    }
    function getInfoSrc() {
        return info2;
    }

    function setInfoFiles(value) {
        info1 = value;
    }
    function setInfoSrc(value) {
        info2 = value;
    }
    function setPostImageSize(value) {
        postImgMB = value;
    }
    function getPostImageSize() {
        return postImgMB;
    }

});