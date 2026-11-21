import pandas as pd, numpy as np, sys, warnings; warnings.filterwarnings("ignore")
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import LeaveOneGroupOut
from sklearn.metrics import balanced_accuracy_score
df=pd.read_csv(sys.argv[1]); df['date']=pd.to_datetime(df.image_date); df['month']=df.date.dt.month
df['broad']=df.system_class.replace({'ORGANIC':'ORG','BIODYNAMIC':'ORG','CONVENTIONAL':'INP'})
W={'winter wheat 1':[3,4,5,6,7],'winter wheat 2':[3,4,5,6,7],'soybeans':[5,6,7,8,9],'potatoes':[4,5,6,7,8,9],'grass-clover 1':list(range(3,11)),'grass-clover 2':list(range(3,11))}
def run(c, mode):
    d=df[(df.crop_type==c)&df.broad.isin(['ORG','INP'])&df.month.isin(W[c])]
    F=d.pivot_table(index='row_id',columns='image_date',values='NDVI_mean')
    nan_share=F.isna().mean().mean()
    if mode=='original': F=F.ffill().bfill()           # what the notebook did (axis=0: copies from neighbouring PLOT)
    else:                F=F.ffill(axis=1).bfill(axis=1)  # fill along time, within the same plot
    y=d.groupby('row_id').broad.first().loc[F.index]
    yt,yp=[],[]
    for tr,te in LeaveOneGroupOut().split(F,y,groups=F.index):
        rf=RandomForestClassifier(n_estimators=100,random_state=42).fit(F.iloc[tr],y.iloc[tr]); yp+=list(rf.predict(F.iloc[te])); yt+=list(y.iloc[te])
    return balanced_accuracy_score(yt,yp), nan_share, len(F)
for c in W:
    a,n,p=run(c,'original'); b,_,_=run(c,'within-plot')
    print(f"{c:15s} plots={p:2d} missing-cells={n:4.0%}  original={a:.3f}  fill-within-plot={b:.3f}")
