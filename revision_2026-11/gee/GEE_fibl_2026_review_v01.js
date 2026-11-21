// =====================================================
// FiBL DOK — PlanetScope 2017-2019 — REVIEW v01 (2026-11-11)
// Change vs test_fibl_2026_5_corrections:
//   AnalyticMS = TOA radiance -> converted to TOA reflectance with each
//   scene's reflectance coefficients (Planet _metadata.xml),
//   instead of the fixed x0.0001 factor.
// Everything else (plots, -0.5 m buffer, UDM2 mask, daily median
// composites, reducers, count >= 3) is unchanged.
// =====================================================

// -----------------------------------------------------
// 0. Radiance -> TOA reflectance coefficients [Blue, Green, Red, NIR]
// -----------------------------------------------------
var coef = {
  '20170214_094059_0e0f': [4.014705516474007e-05, 4.199397716950377e-05, 4.7079024262607576e-05, 6.895160584699007e-05],
  '20170214_122154_0c24': [3.193783060685174e-05, 3.412782455872586e-05, 3.809338818812471e-05, 5.7622928689925754e-05],
  '20170223_124739_1_0c19': [3.0284129406563736e-05, 3.236072819170224e-05, 3.612095986181803e-05, 5.463928501319471e-05],
  '20170328_093445_100c': [2.5856619504863727e-05, 2.7358305308050893e-05, 3.0435498768596973e-05, 4.582371895616511e-05],
  '20170408_094218_0e2f': [2.343566292461349e-05, 2.5040510487010517e-05, 2.7904773339798174e-05, 4.310082311599015e-05],
  '20170421_093553_0f35': [2.2111517891705e-05, 2.3478404725541883e-05, 2.6178620673047486e-05, 3.9043155743853454e-05],
  '20170517_094325_0e1f': [2.0632008264059076e-05, 2.1604038321861308e-05, 2.4235848606539582e-05, 3.596553811583446e-05],
  '20170611_093720_103d': [1.9964161216525397e-05, 2.112144216928195e-05, 2.358584910896965e-05, 3.5662075718171016e-05],
  '20170626_093756_1003': [1.9933476157025986e-05, 2.1125379210190062e-05, 2.3591761416343755e-05, 3.5063765862193474e-05],
  '20170717_093820_102e': [2.0468832148785644e-05, 2.166147964244914e-05, 2.4171444083741855e-05, 3.606017654934939e-05],
  '20170818_094211_1006': [2.2281495703627315e-05, 2.3551890770612012e-05, 2.6299376790421146e-05, 3.992353973311419e-05],
  '20170829_094602_0e14': [2.3481022338367217e-05, 2.4576787871050356e-05, 2.7551978079708267e-05, 4.004343703474528e-05],
  '20170924_094331_101b': [2.687339678053772e-05, 2.84680370972767e-05, 3.170324169207024e-05, 4.775845654864228e-05],
  '20171007_094323_1013': [2.9781512024947145e-05, 3.1489554023537885e-05, 3.5111635142585576e-05, 5.2466161171820446e-05],
  '20171013_094345_1008': [3.10511450929e-05, 3.29597799879e-05, 3.67667521015e-05, 5.71758516852e-05],
  '20171015_094433_1030': [3.187820722225329e-05, 3.376865985428347e-05, 3.7709056412987875e-05, 5.639003719906096e-05],
  '20171015_094535_1012': [3.198221814025272e-05, 3.381164734666972e-05, 3.764555993360773e-05, 5.636924471314149e-05],
  '20171015_094536_1012': [3.193135381336898e-05, 3.37578735066072e-05, 3.758568866208468e-05, 5.6279595406245216e-05],
  '20171101_094350_1025': [3.797334720177522e-05, 4.018024455949172e-05, 4.4790527320997255e-05, 6.720275631608102e-05],
  '20171225_103116_0c38': [5.033226084229796e-05, 5.37835706130103e-05, 6.003308033828303e-05, 9.08105598348395e-05],
  '20180125_094915_1044': [4.855589723282688e-05, 5.14492430425581e-05, 5.746674605717364e-05, 8.635040676815496e-05],
  '20180204_110557_0c19': [3.556389457431522e-05, 3.8002529651994226e-05, 4.241832384226787e-05, 6.416515217386619e-05],
  '20180308_094925_1029': [2.989430844004036e-05, 3.1636036235985844e-05, 3.5208682841939465e-05, 5.315754959893491e-05],
  '20180324_095050_0f15': [2.5726637491665953e-05, 2.7229863856360193e-05, 3.0322713957576614e-05, 4.5308333684560364e-05],
  '20180406_095054_1022': [2.351706389108479e-05, 2.4861666217857904e-05, 2.7697894315238166e-05, 4.170278666294689e-05],
  '20180419_095119_0f12': [2.1898071730630397e-05, 2.3097243035205072e-05, 2.573459835747582e-05, 3.8660975182025476e-05],
  '20180429_094327_103f': [2.126315592131161e-05, 2.2487029085601833e-05, 2.5031445948378192e-05, 3.7133481052685145e-05],
  '20180508_094221_0f4a': [2.06909474688092e-05, 2.1880039571875064e-05, 2.4426135771667617e-05, 3.6592077345361565e-05],
  '20180530_093923_103f': [2.0014049333701412e-05, 2.1166025925461583e-05, 2.3560970721312314e-05, 3.4952070354505655e-05],
  '20180616_095337_1011': [1.948195736843178e-05, 2.062760464754108e-05, 2.2999496784013433e-05, 3.447459798853215e-05],
  '20180620_095326_101d': [1.9503586191482385e-05, 2.0633146551592568e-05, 2.3044907713009366e-05, 3.472974500952777e-05],
  '20180626_095254_103d': [1.9610890048802713e-05, 2.0747692605841585e-05, 2.3168491206171318e-05, 3.503102575840888e-05],
  '20180701_095406_1008': [1.9491459555059815e-05, 2.0689549987778642e-05, 2.3079266784322207e-05, 3.589048962007025e-05],
  '20180719_095334_102c': [2.0174716872000438e-05, 2.128818990928246e-05, 2.3729189382835385e-05, 3.57315661835812e-05],
  '20180724_095504_101d': [2.0268125789005575e-05, 2.144196485840635e-05, 2.3948266936020243e-05, 3.609114926672347e-05],
  '20180802_095503_1034': [2.0631534871330782e-05, 2.185303530296983e-05, 2.4337145994549198e-05, 3.6629157323697755e-05],
  '20180803_095434_103b': [2.0709929906823237e-05, 2.1923988711958696e-05, 2.4473274205158e-05, 3.722571066037094e-05],
  '20180821_095510_1032': [2.207647881600282e-05, 2.327087683160191e-05, 2.586527900229914e-05, 3.82877338383898e-05],
  '20180911_095655_0f22': [2.409864100734239e-05, 2.548154488911615e-05, 2.8402058692562404e-05, 4.213605928167793e-05],
  '20180925_095642_1024': [2.637795871648497e-05, 2.7893273254111238e-05, 3.113415256386628e-05, 4.685232395227809e-05],
  '20181005_092013_0f49': [3.086409425949364e-05, 3.261325168635445e-05, 3.6169064846253406e-05, 5.3995008626297383e-05],
  '20181025_095736_101e': [3.413381368592771e-05, 3.607165171707686e-05, 4.0161429019013014e-05, 6.056169682621187e-05],
  '20181025_095737_101e': [3.407012346825483e-05, 3.6004345691127934e-05, 4.008649188541844e-05, 6.0448694871933025e-05],
  '20181107_095734_1044': [3.89364101064869e-05, 4.125655051059455e-05, 4.6081916296147174e-05, 6.924338839142693e-05],
  '20190119_100009_1032': [4.968421454462774e-05, 5.2372266735980206e-05, 5.821109797072093e-05, 8.616845097032523e-05],
  '20190217_100034_0f22': [3.570665042450989e-05, 3.7755681548802285e-05, 4.208296977255891e-05, 6.24324640787377e-05],
  '20190323_102458_42_105c': [2.4401516412169824e-05, 2.6578497837408242e-05, 3.17770778246136e-05, 4.719539569438112e-05],
  '20190419_095947_103c': [2.1555574152208032e-05, 2.2774640657344496e-05, 2.5394184169266485e-05, 3.8404242617548624e-05],
  '20190531_100029_1014': [1.9269392669655788e-05, 2.0451191957642908e-05, 2.2798980055191283e-05, 3.4378450498665114e-05],
  '20190608_095244_0e26': [1.9538084986542707e-05, 2.0597868219670816e-05, 2.296424244071661e-05, 3.4756845179828106e-05],
  '20190627_100451_1004': [1.9370653871749395e-05, 2.0510907564381403e-05, 2.2895105181174246e-05, 3.407322043348701e-05],
  '20190723_100233_103d': [2.0021095359128797e-05, 2.1181676665858744e-05, 2.3653111644171015e-05, 3.576377744670599e-05],
  '20190723_100234_103d': [2.0012084644496474e-05, 2.1172143618817786e-05, 2.364246630057872e-05, 3.574768156448948e-05],
  '20190809_100443_100c': [2.080238248027839e-05, 2.201053122676195e-05, 2.4486220491557367e-05, 3.6866479325173244e-05],
  '20190826_102023_36_1064': [2.1153659184969554e-05, 2.305468280598533e-05, 2.7853281850396672e-05, 4.524033466290526e-05],
  '20190912_100357_1011': [2.39098510471602e-05, 2.5315883063248773e-05, 2.8226863033612478e-05, 4.231004550662785e-05],
  '20190921_095448_0e3a': [2.554427383943022e-05, 2.7024216109117358e-05, 3.018954918345053e-05, 4.5858291857235415e-05],
};

// -----------------------------------------------------
// 1. Plots
// -----------------------------------------------------
var plotsRaw = ee.FeatureCollection('projects/polar-plate-334604/assets/fibl_dok_plots');
var BUFFER_M = -0.5;   // inward buffer (sensitivity later: -1, -1.5)

var plotsBuf = plotsRaw.map(function(f) {
  return f.setGeometry(f.geometry().buffer(BUFFER_M));
});

var plotList = plotsBuf.toList(plotsBuf.size());
var plotsWithId = ee.FeatureCollection(
  ee.List.sequence(0, plotsBuf.size().subtract(1)).map(function(i) {
    var f = ee.Feature(plotList.get(i));
    return f.set({'row_id': i, 'dok_plot_id': f.get('plot_id')});
  })
);

// system_class from BIO: M = MINERAL and N = NOFERT are now separate
// (the old script labelled both as CONTROL).
var plotsClassified = plotsWithId.map(function(f) {
  var bio = ee.String(f.get('BIO'));
  var systemClass = ee.Algorithms.If(ee.List(['O1','O2']).contains(bio), 'ORGANIC',
    ee.Algorithms.If(ee.List(['D1','D2']).contains(bio), 'BIODYNAMIC',
    ee.Algorithms.If(ee.List(['K1','K2']).contains(bio), 'CONVENTIONAL',
    ee.Algorithms.If(ee.List(['M']).contains(bio), 'MINERAL',
    ee.Algorithms.If(ee.List(['N']).contains(bio), 'NOFERT', 'OTHER')))));
  return f.set('system_class', systemClass);
});
print('Plots:', plotsClassified.size());
print('System classes:', plotsClassified.aggregate_histogram('system_class'));

// -----------------------------------------------------
// 2. Scene list (57 scenes)
// -----------------------------------------------------
var analyticImages = [
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170214_094059_0e0f_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170214_122154_0c24_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170223_124739_1_0c19_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170328_093445_100c_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170408_094218_0e2f_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170421_093553_0f35_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170517_094325_0e1f_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170611_093720_103d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170626_093756_1003_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170717_093820_102e_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170818_094211_1006_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170829_094602_0e14_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20170924_094331_101b_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171007_094323_1013_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171013_094345_1008_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171015_094433_1030_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171015_094535_1012_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171015_094536_1012_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171101_094350_1025_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20171225_103116_0c38_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180125_094915_1044_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180204_110557_0c19_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180308_094925_1029_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180324_095050_0f15_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180406_095054_1022_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180419_095119_0f12_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180429_094327_103f_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180508_094221_0f4a_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180530_093923_103f_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180616_095337_1011_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180620_095326_101d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180626_095254_103d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180701_095406_1008_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180719_095334_102c_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180724_095504_101d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180802_095503_1034_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180803_095434_103b_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180821_095510_1032_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180911_095655_0f22_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20180925_095642_1024_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20181005_092013_0f49_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20181025_095736_101e_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20181025_095737_101e_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20181107_095734_1044_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190119_100009_1032_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190217_100034_0f22_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190323_102458_42_105c_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190419_095947_103c_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190531_100029_1014_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190608_095244_0e26_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190627_100451_1004_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190723_100233_103d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190723_100234_103d_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190809_100443_100c_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190826_102023_36_1064_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190912_100357_1011_3B_AnalyticMS_clip',
  'projects/polar-plate-334604/assets/planetscope_2016_2019/20190921_095448_0e3a_3B_AnalyticMS_clip'
];

function extractDateClient(p) {
  var s = p.split('/').pop().slice(0, 8);
  return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
}

// -----------------------------------------------------
// 3. Per-scene preparation: TOA reflectance, UDM2 mask, indices
// -----------------------------------------------------
function prepareIndices(analyticPath) {
  var udmPath = analyticPath.replace('AnalyticMS', 'udm2');
  var dateString = extractDateClient(analyticPath);
  var sceneId = analyticPath.split('/').pop().replace('_3B_AnalyticMS_clip', '');
  var k = coef[sceneId];
  if (!k) { throw new Error('No reflectance coefficient for ' + sceneId); }

  // Radiance (DN) x per-band coefficient = TOA reflectance (0-1)
  var img = ee.Image(analyticPath)
    .select([0, 1, 2, 3])
    .multiply(ee.Image.constant(k))
    .rename(['Blue', 'Green', 'Red', 'NIR']);

  var udm = ee.Image(udmPath);
  var clearMask = udm.select('b1').eq(1)
    .and(udm.select('b6').eq(0))
    .and(udm.select('b8').eq(0));
  var m = img.updateMask(clearMask);

  var ndvi  = m.normalizedDifference(['NIR', 'Red']).rename('NDVI');
  var gndvi = m.normalizedDifference(['NIR', 'Green']).rename('GNDVI');
  var savi  = m.expression('((NIR - RED) / (NIR + RED + 0.5)) * 1.5',
                {NIR: m.select('NIR'), RED: m.select('Red')}).rename('SAVI');
  var msavi = m.expression('(2 * NIR + 1 - sqrt(pow(2 * NIR + 1, 2) - 8 * (NIR - RED))) / 2',
                {NIR: m.select('NIR'), RED: m.select('Red')}).rename('MSAVI');
  var evi   = m.expression('2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))',
                {NIR: m.select('NIR'), RED: m.select('Red'), BLUE: m.select('Blue')}).rename('EVI');
  var evi2  = m.expression('2.5 * ((NIR - RED) / (NIR + 2.4 * RED + 1))',
                {NIR: m.select('NIR'), RED: m.select('Red')}).rename('EVI2');

  return ee.Image.cat([ndvi, gndvi, savi, msavi, evi, evi2]).set({
    'image_date': dateString,
    'image_year': dateString.slice(0, 4),
    'scene_id': sceneId,
    'system:time_start': ee.Date(dateString).millis()
  });
}

var sceneCollection = ee.ImageCollection.fromImages(analyticImages.map(prepareIndices));
print('Scenes:', sceneCollection.size());

// -----------------------------------------------------
// 4. Daily median composites (same-day scenes merged)
// -----------------------------------------------------
var uniqueDates = ee.List(sceneCollection.aggregate_array('image_date')).distinct().sort();
var dailyComposites = ee.ImageCollection.fromImages(
  uniqueDates.map(function(d) {
    d = ee.String(d);
    var sameDay = sceneCollection.filter(ee.Filter.eq('image_date', d));
    return sameDay.median().set({
      'image_date': d,
      'image_year': d.slice(0, 4),
      'n_scenes_that_day': sameDay.size(),
      'system:time_start': ee.Date(d).millis()
    });
  })
);
print('Unique dates (expect 52):', dailyComposites.size());
print('Max possible rows (96 x 52 = 4992):', plotsClassified.size().multiply(dailyComposites.size()));

// -----------------------------------------------------
// 5. CHECK: NDVI on 2018-06-16 over the plots (was ~0.42 with radiance)
// -----------------------------------------------------
var check = ee.Image(sceneCollection.filter(ee.Filter.eq('scene_id', '20180616_095337_1011')).first());
print('CHECK NDVI 2018-06-16 p5/p50/p95 (expect p50 ~0.55-0.6):',
  check.select('NDVI').reduceRegion({reducer: ee.Reducer.percentile([5, 50, 95]),
                                      geometry: plotsClassified.geometry(), scale: 3}));

// -----------------------------------------------------
// 6. Plot statistics per date
// -----------------------------------------------------
var plotReducer = ee.Reducer.mean()
  .combine({reducer2: ee.Reducer.stdDev(), sharedInputs: true})
  .combine({reducer2: ee.Reducer.count(), sharedInputs: true});

var plotStats = dailyComposites.map(function(img) {
  var imageYear = ee.String(img.get('image_year'));
  return img.reduceRegions({collection: plotsClassified, reducer: plotReducer, scale: 3})
    .map(function(f) {
      return f.set({
        'image_date': img.get('image_date'),
        'image_year': imageYear,
        'crop_type': f.get(imageYear),
        'n_scenes_that_day': img.get('n_scenes_that_day')
      });
    });
}).flatten().filter(ee.Filter.notNull(['NDVI_mean']));

var plotStatsFiltered = plotStats.filter(ee.Filter.gte('NDVI_count', 3));
print('Rows with NDVI_count >= 3:', plotStatsFiltered.size());

// -----------------------------------------------------
// 7. Export
// -----------------------------------------------------
Export.table.toDrive({
  collection: plotStatsFiltered,
  description: 'FIBL_PS_TOAref_2017_2019_v01',
  fileFormat: 'CSV',
  selectors: ['row_id','dok_plot_id','plot_id','BIO','GROUP','system_class',
              'image_date','image_year','crop_type','n_scenes_that_day',
              '2017','2018','2019',
              'NDVI_mean','NDVI_stdDev','NDVI_count',
              'GNDVI_mean','GNDVI_stdDev','GNDVI_count',
              'SAVI_mean','SAVI_stdDev','SAVI_count',
              'MSAVI_mean','MSAVI_stdDev','MSAVI_count',
              'EVI_mean','EVI_stdDev','EVI_count',
              'EVI2_mean','EVI2_stdDev','EVI2_count']
});

Map.centerObject(plotsClassified, 17);
Map.addLayer(check.select('NDVI'), {min: 0, max: 0.9, palette: ['brown','yellow','green','darkgreen']}, 'NDVI 2018-06-16 (TOA refl.)');
Map.addLayer(plotsClassified.style({color: 'yellow', fillColor: '00000000', width: 1}), {}, 'DOK plots');
