# FiBL DOK PlanetScope Farming-System Classification

Code and data accompanying:

> Stratis, P., Kolokoussis, P., Karantzalos, K., Argialas, D. (2026). *Remote Sensing Detection of Management-Related Spectral Patterns in a Long-Term Organic, Biodynamic and Conventional Farming Systems Experiment Using PlanetScope Time Series.* Submitted to *Precision Agriculture* (Springer), PANGEOS special issue.

## Overview

This repository contains the plot-level multi-temporal PlanetScope vegetation-index dataset and the analysis notebook used to evaluate whether biodynamic, organic, and conventional farming systems can be distinguished in the FiBL DOK long-term trial (Therwil, Switzerland) using four-band PlanetScope imagery (2017–2019).

The workflow covers:

- Loading and cleaning the plot-level vegetation index dataset (NDVI, GNDVI, EVI, SAVI, MSAVI; mean, standard deviation, valid pixel count)
- Crop-type classification baseline (season-long vs. monthly phenological features)
- Kruskal–Wallis non-parametric separability testing by treatment class and crop type
- Temporal NDVI profile analysis by farming system (2017–2019)
- Within-plot spectral heterogeneity analysis
- Random Forest and SVM classification of farming systems (5-class and organic-based vs. input-based 2-class grouping), using Leave-One-Group-Out cross-validation with plot identifier as the grouping variable
- Crop-specific phenological window optimization

PlanetScope image acquisition, cloud/quality masking (UDM2), and vegetation index calculation were performed upstream in Google Earth Engine; this repository covers the downstream plot-level statistical and machine-learning analysis in Python.

## Repository structure

```
.
├── data/
│   └── FIBL_PlanetScope_2017_2019_WITH_CROPS.csv   # plot-level vegetation index dataset (5403 records, 96 plots)
├── notebooks/
│   └── fibl_dok_classification.ipynb               # full analysis workflow
├── requirements.txt
├── LICENSE
└── README.md
```

## Data

`data/FIBL_PlanetScope_2017_2019_WITH_CROPS.csv` contains 5403 plot-level records across the 96 DOK experimental plots, February 2017 – September 2019, after compositing and quality filtering (minimum 3 valid pixels per plot). Key columns:

| Column | Description |
|---|---|
| `dok_plot_id`, `plot_id` | Plot identifiers |
| `system_class` | Farming system treatment (e.g. CONTROL, BIODYN, BIOORG, CONFYM, CONMIN) |
| `image_date`, `image_year` | PlanetScope acquisition date and year |
| `crop_type` | Crop grown in that plot for the given rotation year |
| `NDVI_mean`, `NDVI_stdDev`, `NDVI_count` | Plot-level NDVI statistics (analogous columns for GNDVI, EVI, SAVI, MSAVI) |

Access to the underlying FiBL DOK experimental design and plot metadata is subject to the data use conditions of the Research Institute of Organic Agriculture (FiBL); this CSV contains only the derived PlanetScope vegetation-index features used in the analysis.

## Usage

```bash
git clone https://github.com/<your-username>/fibl-dok-planetscope.git
cd fibl-dok-planetscope
pip install -r requirements.txt
jupyter notebook notebooks/fibl_dok_classification.ipynb
```

The notebook expects the CSV at `data/FIBL_PlanetScope_2017_2019_WITH_CROPS.csv` (update the path at the top of the notebook if running outside this repo structure, e.g. in Google Colab where the original development was done).

## Citation

If you use this code or data, please cite the manuscript above.

## Contact

Petros Stratis — stratisaua@mail.ntua.gr
Remote Sensing Laboratory, School of Rural, Surveying and Geoinformatics Engineering, National Technical University of Athens

## Acknowledgements

This research was supported by the Hellenic Foundation for Research and Innovation (H.F.R.I.) under the 4th Call for H.F.R.I. PhD Fellowships, Fellowship Number 011270. The authors thank the Research Institute of Organic Agriculture (FiBL) for the DOK trial data.
