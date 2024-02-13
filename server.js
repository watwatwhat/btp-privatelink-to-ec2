const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3030;

// SAP Private Link Service のドメイン名を取得
const vcapServices = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES) : null;
let hostname = '';
if (vcapServices) {
    // サービスインスタンス名が 'btp-privatelink-vpce' のバインディングを検索
    for (let serviceType in vcapServices) {
        vcapServices[serviceType].forEach((serviceInstance) => {
            if (serviceInstance.name === 'btp-privatelink-vpce') {
                // serviceKey の hostname を取得
                hostname = serviceInstance.credentials.hostname;
            }
        });
    }
}

app.get('/', async (req, res) => {
  try {
    // EC2インスタンス上のNginxからの応答を得る
    const response = await axios.get(`http://${hostname}`);
    // 応答をクライアントに送信
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Nginx response:', error);
    res.status(500).send('Failed to fetch Nginx response');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});