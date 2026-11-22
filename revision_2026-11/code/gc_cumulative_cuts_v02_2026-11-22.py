# Exploratory (Petros's question, 22 Nov 2026): grass-clover from the start of the season
#   W1 = start -> day before 1st cut;  W2 = start -> day before 2nd cut.
# Cuts = first dates (from April on) where the mean NDVI of all grass-clover plots drops by >= 0.08.
# (1) mixed model NDVI ~ system + date + rep, random intercept per plot; LR test of system; contrasts vs CONFYM
# (2) Random Forest organic (BIODYN+BIOORG) vs CONFYM on the per-date NDVI, leave-one-replicate-out (4 folds),
#     mean of 20 seeds; permutation test (99 permutations within replicate -> smallest possible p = 0.01).
import sys, numpy as np, pandas as pd, statsmodels.formula.api as smf, warnings
from scipy.stats import chi2
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import balanced_accuracy_score
warnings.filterwarnings('ignore')
CM={'D1':'BIODYN','D2':'BIODYN','O1':'BIOORG','O2':'BIOORG','K1':'CONFYM','K2':'CONFYM','M':'CONMIN','N':'NOFERT'}
d=pd.read_csv(sys.argv[1]); d['date']=pd.to_datetime(d.image_date)
d['system']=d.BIO.map(CM); d['rep']=(d.plot_id-1)//24+1
out=[]
for crop in ['grass-clover 1','grass-clover 2']:
    g=d[d.crop_type==crop].copy()
    m=g.groupby('date').NDVI_mean.mean().sort_index()
    cuts=[t for t,v in m.diff().items() if v<=-0.08 and t.month>=4]
    print(crop,'apparent cuts (first date after the drop):',[str(c.date()) for c in cuts], flush=True)
    for w,cut in [('start to 1st cut',cuts[0]),('start to 2nd cut',cuts[1])]:
        s=g[g.date<cut].copy(); s['date_s']=s.date.dt.strftime('%Y%m%d')
        f1=smf.mixedlm("NDVI_mean ~ C(system, Treatment('CONFYM')) + C(date_s) + C(rep)",s,groups=s.plot_id).fit(reml=False,method='powell')
        f0=smf.mixedlm("NDVI_mean ~ C(date_s) + C(rep)",s,groups=s.plot_id).fit(reml=False,method='powell')
        p_sys=chi2.sf(2*(f1.llf-f0.llf),4)
        co={k.split('T.')[1].rstrip(']'):(f1.params[k],f1.pvalues[k]) for k in f1.params.index if 'system' in k}
        c=s[s.system.isin(['BIODYN','BIOORG','CONFYM'])]
        X=c.pivot_table(index='plot_id',columns='date_s',values='NDVI_mean')
        meta=c.groupby('plot_id').agg(system=('system','first'),rep=('rep','first')).loc[X.index]
        y=(meta.system=='CONFYM').astype(int).values; grp=meta.rep.values; Xv=X.values
        def cv(yy,seed,n=300):
            pred=np.zeros_like(yy)
            for r in np.unique(grp):
                tr=grp!=r
                pred[~tr]=RandomForestClassifier(n,class_weight='balanced',random_state=seed,n_jobs=-1).fit(Xv[tr],yy[tr]).predict(Xv[~tr])
            return balanced_accuracy_score(yy,pred)
        bas=[cv(y,s_) for s_ in range(20)]; ba=np.mean(bas)
        rng=np.random.default_rng(0); null=[]
        for k in range(99):
            yp=y.copy()
            for r in np.unique(grp):
                idx=np.where(grp==r)[0]; yp[idx]=rng.permutation(yp[idx])
            null.append(cv(yp,k))
        p_ba=(1+sum(n>=ba for n in null))/100
        row=dict(crop=crop,window=w,from_=str(s.date.min().date()),to=str(s.date.max().date()),n_dates=s.date.nunique(),
            p_system=round(p_sys,4),BIODYN_CONFYM=round(co['BIODYN'][0],3),p_BD=round(co['BIODYN'][1],3),
            BIOORG_CONFYM=round(co['BIOORG'][0],3),p_BO=round(co['BIOORG'][1],3),
            CONMIN_CONFYM=round(co['CONMIN'][0],3),NOFERT_CONFYM=round(co['NOFERT'][0],3),p_N=round(co['NOFERT'][1],3),
            BA_org_vs_CONFYM=round(ba,3),BA_sd=round(np.std(bas),3),p_BA=p_ba)
        print(row, flush=True); out.append(row)
pd.DataFrame(out).to_csv('gc_cumulative_cuts_results_v02_2026-11-22.csv',index=False)
