const backstop = require("backstopjs");
const defaultConfig = require("../../default.json");
const fs = require('fs');
const path = require('path');
let config = {...defaultConfig};
const dbhandler = require('../db/handler');
const setConfig = (req, uuid) => {
    const filename = `snapshots/${uuid}`;
    if (fs.existsSync(path.join(__dirname, `../../${filename}/backstop.json`))) {
        fs.readFile(path.join(__dirname, `../../${filename}/backstop.json`),(err, data) => {
            // config = JSON.parse(data);
            console.log('**** READFILE ****', JSON.parse(data));
        })
    }
    config.id = req.body.id;
    config.scenarios[0].label = req.body.id;
    config.scenarios[0].referenceUrl = req.body.referenceUrl
    config.scenarios[0].url = req.body.testUrl
    config.scenarios[0].viewportLabel = req.body.viewportLabel
    config.scenarios[0].viewportWidth = req.body.viewportWidth
    config.scenarios[0].delay = req.body['scenario-delay']
    config.scenarios[0].readyEvent = req.body['scenario-readyEvent']
    config.scenarios[0].readySelector = req.body['scenario-readySelector']
    config.scenarios[0].hideSelector = req.body['scenario-hideSelector']
    config.scenarios[0].removeSelector = req.body['scenario-removeSelector']
    config.scenarios[0].hoverSelector = req.body['scenario-hoverSelector']
    config.scenarios[0].clickSelector = req.body['scenario-clickSelector']
    config.scenarios[0].postInteractionWait = req.body['scenario-postInteractionWait']
    config.viewports = [];
    config.asyncCaptureLimit = 2;
    config.asyncCompareLimit = 10;


    for (let index in req.body.viewportLabel) {
        config.viewports.push({
            label: req.body.viewportLabel[index], 
            width: parseInt(req.body.viewportWidth[index]), 
            height: parseInt(req.body.viewportHeight[index])
        })
    }
    // console.log(req.body.viewportLabel);
    // console.log('Viewport Config Labels', config.scenarios[0].viewportLabel);
    // fs.rmSync(path.join(__dirname, `../../${filename}`), { recursive: true, force: true });

    config.paths = {
        "bitmaps_reference": path.join(__dirname, `../../${filename}/backstop_data/bitmaps_reference`),
        "bitmaps_test": path.join(__dirname, `../../${filename}/backstop_data/bitmaps_test`),
        "engine_scripts": path.join(__dirname, `../../${filename}/backstop_data/engine_scripts`),
        "html_report": path.join(__dirname, `../../${filename}/backstop_data/html_report`),
        "ci_report": path.join(__dirname, `../../${filename}/backstop_data/ci_report`)
    };
    fs.existsSync(filename) || fs.mkdirSync(filename);
    console.log(JSON.stringify(config));
    fs.writeFile(path.join(__dirname, `../../${filename}/backstop.json`), JSON.stringify(config), (err, res)=>{
        console.log('error', err, 'result', res);
    })
}

const backstopTest = async (req, uuid) => {
    setConfig(req, uuid);
    await backstop("test", {config: config}).catch(err=>console.log(err));
    fs.readdir(path.join(__dirname, `../../snapshots/${uuid}/backstop_data/bitmaps_test`), (err, files) => {
        if (files) {
            fs.readFile(path.join(__dirname, `../../snapshots/${uuid}/backstop_data/bitmaps_test/${files[0]}/report.json`),(err, data) => {
                console.log('**** READFILE REPORT DATA ****', data.toString());
                console.log('**** READFILE REPORT ERROR ****', err);
                const jsonData = JSON.parse(data.toString());
                for (let each of jsonData.tests) {
                    const failed = each.status === 'fail';
                    dbhandler.insert.report(files[0], failed, uuid)
                    .then(result=>console.log('insert result', result))
                    .catch(error=>console.log('insert error', error));
                    
                }
            });
        }
    });
}

const backstopReference = (req, uuid) => {
    setConfig(req, uuid);
    backstop("reference", {config: config}).then((result)=> {
        console.log('*****REFERENCE RESULT******', result);
    });
}


exports.backstopReference = backstopReference;
exports.backstopTest = backstopTest;