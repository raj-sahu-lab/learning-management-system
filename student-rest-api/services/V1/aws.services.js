const CONFIG = require('../../config/config');
const aws = require('aws-sdk');
const { to, TE } = require('./util.service');
aws.config.update({region:CONFIG.AWS_REGION});

const s3 = new aws.S3({
  accessKeyId: CONFIG.accessKeyId,
  secretAccessKey: CONFIG.secretAccessKey,
  Bucket: CONFIG.bucket
});

/* 
    Delete Multipal Quality Folder
*/
module.exports.DeleteFolderFromBucket = async function (folderURL) {

  const listParams = { Bucket: CONFIG.bucket, Prefix: folderURL };
  [err, fileList] = await to(s3.listObjects(listParams).promise());
  if (err) TE(err.message);

  const deleteParams = {
    Bucket: CONFIG.bucket,
    Delete: { Objects: [] }
  };
  if (fileList.Contents.length != 0) {
    fileList.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    [err, result] = await to(s3.deleteObjects(deleteParams).promise());
    if (err) TE(err.message);

    return result;

  } else {

    return null;
  }

};

module.exports.InitLamdaFunctionTranscoder = async function (payload) {


  var elastictranscoder = new aws.ElasticTranscoder();

  const fileURL = payload.key;
  let baseName = fileURL.split('/').reverse()[0].split('.')[0];
  var outputPrefix = baseName + '_' + Date.now().toString();

  var OutputsFormates = [
    {
      Key: '/output/400k',
      PresetId: '1351620000001-200050', // HLS v3 (Apple HTTP Live Streaming), 400 kilobits/second 
      SegmentDuration: '30',
    },
  ];

  var OutputKeysList = ['/output/400k'];

  if (payload.videoHeight != null){
    if (payload.videoHeight >= 360) {
      OutputsFormates.push(
        {
          Key: '/output/1M',
          PresetId: '1351620000001-200030', // HLS v3 (Apple HTTP Live Streaming), 1 megabit/second
          SegmentDuration: '30',
        }
  
      );
  
      OutputKeysList.push('/output/1M');
    }
  
    if (payload.videoHeight >= 720) {
      OutputsFormates.push(
        {
          Key: '/output/2M',
          PresetId: '1351620000001-200010', // HLS v3 (Apple HTTP Live Streaming), 2 megabit/second
          SegmentDuration: '30',
        });
  
        OutputKeysList.push('/output/2M');
    }
  } else {
    OutputsFormates.push(
      {
        Key: '/output/1M',
        PresetId: '1351620000001-200030', // HLS v3 (Apple HTTP Live Streaming), 1 megabit/second
        SegmentDuration: '30',
      }

    );

    OutputKeysList.push('/output/1M');
  }

  var params = {
    Input: { Key: fileURL },
    //PipelineId: CONFIG.elasticTranscode,
    PipelineId: CONFIG.port == 3000 ? '1563604407608-xns6r9' : '1577881842924-w38fhs',
    OutputKeyPrefix: payload.accountId + '/files/HLS/' + outputPrefix,
    Outputs: OutputsFormates,
    Playlists: [
      {
        Format: 'HLSv3',
        Name: '/' + baseName + '-master-playlist',
        OutputKeys: OutputKeysList
      }
    ]
  };
  [err, result] = await to(elastictranscoder.createJob(params).promise());
  if (err) TE(err.message);
  return result;
}