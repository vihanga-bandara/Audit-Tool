# WPO Audit Tool

## Environment Setup

- Install serverless

    ```
    npm install -g serverless
    ```

- Config credentials serverless (Change the replace the access key and secret key with the IAM user’s credentials)

    ```
    config credentials --provider aws --key <access key> --secret <secret key>
    ```

- Install Angular CLI

    ```
    npm install -g @angular/cli
    ```

## Project Setup

- Fork the Audit-Tool repository.
- Clone it to your local machine.
- Install necassary packages.

    ```
    npm run setup
    ```
 
  - To run locally,

      - add .env.dev file with necessary credentials

      - set the proxy configurations by replacing web/proxy.config.json with following code.

      ```
      [
          {
              "context": ["/dev"],
              "target": "http://localhost:3000",
              "secure": false,
              "changeOrigin": false,
              "logLevel": "debug",
              "pathRewrite": { "^/dev": "" }
          }
      ]  
      ```

      - run following command in project root directory.

      ```
      npm run dev
      ```
 
- To deploy

    - remember to change the web/proxy.config.json back to

    ```
    [
        {
            "context": ["/dev"],
            "target": "https://audit.winningproduct.com/",
            "secure": false,
            "changeOrigin": true,
            "logLevel": "debug"
        }
    ]
    ```

    - run following command in project root directory

    ```
    npm run deploy
    ```