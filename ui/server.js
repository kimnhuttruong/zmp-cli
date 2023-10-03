/* eslint no-console: off */
/* eslint global-require: off */
/* eslint import/no-dynamic-require: off */

const path = require('path');
const express = require('express');
const chalk = require('chalk');
const opn = require('opn');
const bodyParser = require('body-parser');
const multer = require('multer');
const fse = require('../utils/fs-extra');
const createApp = require('../create/index');
const buildApp = require('../build/index');
const deployApp = require('../deploy/index');
// const generateAssets = require('../assets/index');
const getCurrentProject = require('../utils/get-current-project');
const { text } = require('../utils/log');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (startPage = '/', port = 3001, query='') => {
  const app = express();
  app.use(express.static(path.resolve(__dirname, 'www')));
  app.use(bodyParser.json());

  let log = [];
  let done = false;
  let error = false;
  let pendingIconFile = false;

  const logger = {
    statusStart: (text) => log.push(text),
    statusDone: (text) => log.push(`✔ ${text}`),
    statusText: (text) => log.push(`${text}`),
    statusError: (text) => log.push(`✖ ${text}`),
    text: (text) => log.push(text),
    error: (text) => log.push(text),
    showOnUI: (text) => log.push(text)
  };

  function clearLog() {
    log = [];
    done = false;
    error = false;
  }

  const cwd = process.cwd();

  app.get('/cwd/*', (req, res) => {
    const localPath = req.path.split('/cwd/')[1];
    res.sendFile(localPath, { root: cwd });
  });

  app.get('/api/cwd/', (req, res) => {
    res.json({ cwd });
  });

  app.get('/api/project/', (req, res) => {
    res.json(getCurrentProject(cwd));
  });

  // Create App
  app.route('/api/create/')
    .get((req, res) => {
      res.json({ log, done, error });
      if (done && !pendingIconFile) {
        clearLog();
        process.exit(0);
      }
    })
    .post(upload.any(), (req, res) => {
      done = false;
      clearLog();
      const file = req.files[0];
      const options = req.body && req.body.options && JSON.parse(req.body.options);
      res.json({});
      if (!options.cwd) options.cwd = cwd;
      if (file && file.buffer) {
        pendingIconFile = true;
      }
      createApp(
        options,
        logger,
        {
          exitOnError: true,
          iconFile: file ? file.buffer : null,
        },
      )
        .then(() => {
          done = true;
        })
        .catch((err) => {
          error = true;
          console.log(err);
        });
    });

  // Deploy App
  app.route('/api/deploy/')
    .get((req, res) => {
      res.json({ log, done, error });
      if (done) {
        clearLog();
        process.exit(0);
      }
    })
    .post(upload.any(), (req, res) => {
      done = false;
      clearLog();
      const options = req.body && req.body.options && JSON.parse(req.body.options);
      res.json({});
      if (!options.cwd) options.cwd = cwd;
      buildApp(
        options,
        logger
      ).then(() => {
        deployApp(
          options,
          logger,
          {
            exitOnError: false
          }
        ).then(() => {
          done = true;
        })
        .catch((err) => {
          error = true;
          console.log(err);
        });;
      })
      .catch((err) => {
        error = true;
        console.log(err);
      });
    });


  // Generate Assets
  app.post('/api/assets/upload/', upload.any(), (req, res) => {
    const file = req.files[0];
    fse.writeFileSync(path.resolve(cwd, 'assets-src', `${file.fieldname}.png`), file.buffer);
    res.send('Ok');
  });
  // app.route('/api/assets/generate/')
  //   .get((req, res) => {
  //     res.json({ log, done, error });
  //     if (done) {
  //       clearLog();
  //       if (pendingIconFile) {
  //         pendingIconFile = false;
  //         process.exit(0);
  //       }
  //     }
  //   })
  //   .post((req, res) => {
  //     const keepLog = req.body && req.body.keepLog;
  //     done = false;
  //     if (!keepLog) {
  //       clearLog();
  //     } else {
  //       log.push('\n\n');
  //     }

  //     const currentProject = getCurrentProject(cwd);

  //     res.json({});

  //     generateAssets({}, currentProject, logger, { exitOnError: true })
  //       .then(() => {
  //         done = true;
  //       }).catch((err) => {
  //         error = true;
  //         console.log(err);
  //       });
  //   });

  const availablePaths = [
    '/',
    '/create/',
    '/deploy/',
    '/qr/'
  ];
  availablePaths.forEach((availablePath) => {
    app.get(availablePath, (req, res) => {
      res.sendFile('www/index.html', { root: __dirname });
    });
  });

  app.listen(port, () => {
    console.log(`${chalk.bold(`\nZMP CLI UI is running on http://localhost:${port}`)} ${chalk.gray('(CTRL + C to exit)')}`);
  });

  opn(`http://localhost:${port}${startPage}?${query}`);
};
