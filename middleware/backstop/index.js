const backstop = require("backstopjs");
const config = require("../../default.json");
const fs = require('fs');
const path = require('path');

function backstopInit(data) {
    return backstop('init', {data});
}

function backstopReference(req,res) {

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    

    console.log('urls', req.body.testUrl, req.body.referenceUrl, 'delay', req.body['scenario-delay']);
    const trimmedFileName = (req.body.testUrl.slice(req.body.testUrl.indexOf('://') + 3, req.body.testUrl.length)).replaceAll('/', '_');
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

    const filename = `snapshots/${trimmedFileName}`;
    fs.rmSync(path.join(__dirname, `../../${filename}`), { recursive: true, force: true });

    config.paths = {
        "bitmaps_reference": path.join(__dirname, `../../${filename}/backstop_data/bitmaps_reference`),
        "bitmaps_test": path.join(__dirname, `../../${filename}/backstop_data/bitmaps_test`),
        "engine_scripts": path.join(__dirname, `../../${filename}/backstop_data/engine_scripts`),
        "html_report": path.join(__dirname, `../../${filename}/backstop_data/html_report`),
        "ci_report": path.join(__dirname, `../../${filename}/backstop_data/ci_report`)
    };
    console.log('save backstop json', `${filename}/backstop.json`)
    fs.existsSync(filename) || fs.mkdirSync(filename);
    fs.writeFile(path.join(__dirname, `../../${filename}/backstop.json`), JSON.stringify(config), (err, res)=>{
        console.log('error', err, 'result', res);
    })
    backstop("reference", {config: config}).then(()=>backstop("test", {config: config}).then(()=>{

    // close
    res.on('close', () => {
        clearInterval(interval);
    res.redirect( '/view-test');

    });
    }))
}


exports.backstopReference = backstopReference;