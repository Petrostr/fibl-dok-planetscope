# Revision (November 2026)

Code and data for the revised manuscript (Precision Agriculture, major revision, Nov 2026).
The submitted version is kept unchanged at the repository root and under the git tag `v1.0-submitted`.
What changed and why is listed in [`CHANGELOG.md`](CHANGELOG.md).

## Contents
| Folder | File | What it is |
|---|---|---|
| `data/` | `FIBL_PS_TOAref_2017_2019_v01.csv` | Main dataset: TOA reflectance, daily median composites, inward buffer 0.5 m; 4992 plot-date records (96 plots x 52 dates) |
| `data/` | `FIBL_PS_TOAref_2017_2019_v02*.csv` | Same processing with inward buffers of 0.5, 1.0 and 1.5 m (buffer sensitivity) |
| `data/` | `dok_plot_replicates_v01_2026-11-12.csv` | Replicate of each plot, used for grouped cross-validation |
| `notebooks/` | `FIBL_revision_analysis_v03_2026-11-22.ipynb` | **Full analysis of the revised manuscript** (all numbers, figures and supplementary tables) |
| `notebooks/` | `FIBL_revision_analysis_v02_2026-11-21.ipynb` | Earlier version (main analysis only), kept for the record |
| `gee/` | `GEE_fibl_2026_review_v01.js` | Google Earth Engine script that produced the main dataset |
| `gee/` | `GEE_fibl_2026_review_v02.js` | Same, for the three buffers |
| `gee/` | `fibl_reflectance_coefficients_GEE.js` | Per-scene reflectance coefficients from the Planet metadata |
| `code/` | `svm_vs_rf_v01_2026-11-22.py` | Stand-alone SVM check (same as notebook v03, section 7e) |
| `code/` | `gc_cumulative_cuts_v02_2026-11-22.py` | Stand-alone grass-clover analysis by cutting period (notebook v03, section 7f) |
| `code/` | `reproduce_submitted_84_4_and_gapfill_bug.py` | Reproduces the submitted 84.4% result and shows the effect of the gap-filling error |

The GEE scripts read the PlanetScope scenes and plot polygons from the authors' Earth Engine assets, which are not public (Planet licence); they document the processing exactly.

## Run the analysis
```bash
pip install -r requirements.txt
cd notebooks
jupyter notebook FIBL_revision_analysis_v03_2026-11-22.ipynb
```
Copy the CSVs from `data/` next to the notebook, or change `DATA` and `BUFFER_FILES` in the first code cell.
`QUICK = True` gives a check run in about 10 minutes; `QUICK = False` (20 runs, 199 permutations) reproduces the numbers of the manuscript.
