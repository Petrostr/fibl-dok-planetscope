// GEE script fibl_2026_review_v02 (12 Nov 2026) — as given in chat; run by Petros in GEE.
// Paste the 57-scene coefficient table from GEE_fibl_2026_review_v01.js (var coef = {...};) ABOVE this code.
// Exports: FIBL_PS_TOAref_2017_2019_v02 (-0.5 m), _v02_buf10 (-1.0 m), _v02_buf15 (-1.5 m).
// The -0.5 m export is bit-identical to v01.

var BUFFERS = [[-0.5, ''], [-1.0, '_buf10'], [-1.5, '_buf15']];

var plotsRaw = ee.FeatureCollection('projects/polar-plate-334604/assets/fibl_dok_plots');
function makePlots(bufferM) {
  var buf = plotsRaw.map(function(f) { return f.setGeometry(f.geometry().buffer(bufferM)); });
  var list = buf.toList(buf.size());
  var withId = ee.FeatureCollection(
    ee.List.sequence(0, buf.size().subtract(1)).map(function(i) {
      var f = ee.Feature(list.get(i));
      return f.set({'row_id': i, 'dok_plot_id': f.get('plot_id'), 'buffer_m': bufferM});
    })
  );
  return withId.map(function(f) {
    var bio = ee.String(f.get('BIO'));
    var systemClass = ee.Algorithms.If(ee.List(['O1','O2']).contains(bio), 'ORGANIC',
      ee.Algorithms.If(ee.List(['D1','D2']).contains(bio), 'BIODYNAMIC',
      ee.Algorithms.If(ee.List(['K1','K2']).contains(bio), 'CONVENTIONAL',
      ee.Algorithms.If(ee.List(['M']).contains(bio), 'MINERAL',
      ee.Algorithms.If(ee.List(['N']).contains(bio), 'NOFERT', 'OTHER')))));
    return f.set('system_class', systemClass);
  });
}

var base = 'projects/polar-plate-334604/assets/planetscope_2016_2019/';
var analyticImages = Object.keys(coef).map(function(id) { return base + id + '_3B_AnalyticMS_clip'; });

function extractDateClient(p) {
  var s = p.split('/').pop().slice(0, 8);
  return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
}

function prepareIndices(analyticPath) {
  var udmPath = analyticPath.replace('AnalyticMS', 'udm2');
  var dateString = extractDateClient(analyticPath);
  var sceneId = analyticPath.split('/').pop().replace('_3B_AnalyticMS_clip', '');
  var k = coef[sceneId];
  if (!k) { throw new Error('No reflectance coefficient for ' + sceneId); }
  var img = ee.Image(analyticPath).select([0, 1, 2, 3])
    .multiply(ee.Image.constant(k))
    .rename(['Blue', 'Green', 'Red', 'NIR']);
  var udm = ee.Image(udmPath);
  var clearMask = udm.select('b1').eq(1).and(udm.select('b6').eq(0)).and(udm.select('b8').eq(0));
  var m = img.updateMask(clearMask);
  var ndvi  = m.normalizedDifference(['NIR', 'Red']).rename('NDVI');
  var gndvi = m.normalizedDifference(['NIR', 'Green']).rename('GNDVI');
  var savi  = m.expression('((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {NIR: m.select('NIR'), RED: m.select('Red')}).rename('SAVI');
  var msavi = m.expression('(2 * NIR + 1 - sqrt(pow(2 * NIR + 1, 2) - 8 * (NIR - RED))) / 2', {NIR: m.select('NIR'), RED: m.select('Red')}).rename('MSAVI');
  var evi   = m.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {NIR: m.select('NIR'), RED: m.select('Red'), BLUE: m.select('Blue')}).rename('EVI');
  var evi2  = m.expression('2.5 * ((NIR - RED) / (NIR + 2.4 * RED + 1))', {NIR: m.select('NIR'), RED: m.select('Red')}).rename('EVI2');
  return ee.Image.cat([ndvi, gndvi, savi, msavi, evi, evi2]).set({
    'image_date': dateString, 'image_year': dateString.slice(0, 4),
    'scene_id': sceneId, 'system:time_start': ee.Date(dateString).millis()
  });
}
var sceneCollection = ee.ImageCollection.fromImages(analyticImages.map(prepareIndices));

var uniqueDates = ee.List(sceneCollection.aggregate_array('image_date')).distinct().sort();
var dailyComposites = ee.ImageCollection.fromImages(uniqueDates.map(function(d) {
  d = ee.String(d);
  var sameDay = sceneCollection.filter(ee.Filter.eq('image_date', d));
  return sameDay.median().set({'image_date': d, 'image_year': d.slice(0, 4),
    'n_scenes_that_day': sameDay.size(), 'system:time_start': ee.Date(d).millis()});
}));

var plotReducer = ee.Reducer.mean()
  .combine({reducer2: ee.Reducer.stdDev(), sharedInputs: true})
  .combine({reducer2: ee.Reducer.count(), sharedInputs: true});

BUFFERS.forEach(function(b) {
  var bufferM = b[0], suffix = b[1];
  var plots = makePlots(bufferM);
  var stats = dailyComposites.map(function(img) {
    var imageYear = ee.String(img.get('image_year'));
    return img.reduceRegions({collection: plots, reducer: plotReducer, scale: 3})
      .map(function(f) {
        return f.set({'image_date': img.get('image_date'), 'image_year': imageYear,
                      'crop_type': f.get(imageYear), 'n_scenes_that_day': img.get('n_scenes_that_day')});
      });
  }).flatten().filter(ee.Filter.notNull(['NDVI_mean']));
  var filtered = stats.filter(ee.Filter.gte('NDVI_count', 3));
  print('Buffer ' + bufferM + ' m — rows with NDVI_count >= 3 (max 4992):', filtered.size());
  Export.table.toDrive({
    collection: filtered,
    description: 'FIBL_PS_TOAref_2017_2019_v02' + suffix,
    fileFormat: 'CSV',
    selectors: ['row_id','dok_plot_id','plot_id','BIO','GROUP','system_class','buffer_m',
                'image_date','image_year','crop_type','n_scenes_that_day','2017','2018','2019',
                'NDVI_mean','NDVI_stdDev','NDVI_count','GNDVI_mean','GNDVI_stdDev','GNDVI_count',
                'SAVI_mean','SAVI_stdDev','SAVI_count','MSAVI_mean','MSAVI_stdDev','MSAVI_count',
                'EVI_mean','EVI_stdDev','EVI_count','EVI2_mean','EVI2_stdDev','EVI2_count']
  });
});
