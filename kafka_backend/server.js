const connect = require('./config/connect');
const connection =  new require('./kafka/Connection');
const Aggregator = require('./services/aggregator');

function handleTopicRequest(topic_name, fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle', res);
            console.log(' data.replyTo ===> ', data.replyTo);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
COREAPP = {};
// Mongo connection
connect();
// Add your TOPICs here
const kafka = require("kafka-node");
const client = new kafka.KafkaClient();
client.loadMetadataForTopics(["etsy_backend_processing"], (err, resp) => {
  console.log(JSON.stringify(resp))
});
// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest("etsy_backend_processing", Aggregator);
