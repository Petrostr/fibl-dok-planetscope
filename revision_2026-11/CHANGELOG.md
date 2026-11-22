# Changelog: submitted version (v1.0-submitted, 30 June 2026) -> revision (Nov 2026)

## Corrections of errors in the submitted analysis
1. **Radiometric level.** The PlanetScope AnalyticMS products are top-of-atmosphere radiance. The submitted processing applied a fixed surface-reflectance scale factor. The revision converts each scene to TOA reflectance with its own `reflectanceCoefficient` from the Planet metadata (no atmospheric correction).
2. **Same-day duplicates.** The submitted dataset had 5403 records, including 411 duplicate plot-date records from dates with 2-3 scenes. The revision uses daily median composites: 4992 records (96 plots x 52 dates).
3. **Treatment coding.** CONMIN (mineral fertiliser) had been coded together with the unfertilised control. The revision codes five classes: BIODYN, BIOORG, CONFYM, CONMIN, NOFERT.
4. **Gap filling.** Missing values in the classification features had been filled across neighbouring plots. The revision interpolates only along the time series of the same plot.

## Changes of method (reviewer requests)
5. Kruskal-Wallis tests on plot-date samples -> linear mixed-effects models per crop (NDVI ~ system + date + replicate, random intercept per plot-year); LR test with Benjamini-Hochberg adjustment across crops; Holm-adjusted pairwise contrasts.
6. Cross-validation grouped by plot -> leave one replicate x year out.
7. Phenological windows chosen by accuracy -> windows fixed in advance from crop phenology; month-wise permutation importance.
8. Single run -> 20 runs, bootstrap 95% CI over groups, permutation test (199).
9. Three classification tasks reported side by side: five classes; organic vs CONFYM; organic vs CONFYM + CONMIN.
10. Random Forest as main classifier (300 trees, sqrt(p) features, balanced class weights, not tuned). SVM re-run on the corrected data as a check (RBF, C=1, gamma default, standardised features, balanced weights, not tuned): same pattern, slightly lower accuracy (Supplementary Table S2).
11. Sensitivity analyses: other indices (GNDVI, SAVI, MSAVI, EVI), plot buffers 0.5/1.0/1.5 m, date-centred NDVI.
12. Exploratory (defined after the main results): grass-clover from the start of the season to the 1st and 2nd apparent cut. Not separable before the 1st cut in either year; 0.78 (p = 0.02) up to the 2nd cut in 2019 only, not significant after correction for the four windows tested.

## Notebook versions
- v01 (21 Nov 2026): revised analysis.
- v02 (21 Nov 2026): same results; adds version history, change table and run log.
- v03 (22 Nov 2026): same results for sections 1-7d; adds GEE processing description, SVM check, grass-clover by cutting period, figures and supplementary tables.

## Effect on the main results
The submitted headline of 84.4% is not reproduced. With the corrected data and methods: organic vs CONFYM balanced accuracy 0.75-0.84 in the arable crops (p <= 0.01), not significant in grass-clover; five classes 0.41-0.54 (chance 0.20).
