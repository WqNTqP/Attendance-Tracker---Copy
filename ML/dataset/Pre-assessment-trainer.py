import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Load dataset

# Use pre-assesment.csv
csv_path = 'ML/dataset/pre-assesment.csv'
df = pd.read_csv(csv_path)

# Select features (exclude non-numeric, target, and PR 101)
feature_cols = [col for col in df.columns if col not in ['id_number','student_name','year_graduated','OJT Placement']]
X = df[feature_cols].apply(pd.to_numeric, errors='coerce').fillna(0)

# Encode target variable
le = LabelEncoder()
y = le.fit_transform(df['OJT Placement'])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train Random Forest model with class weights
clf = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
clf.fit(X_train, y_train)

# Predict and evaluate
y_pred = clf.predict(X_test)
labels = list(range(len(le.classes_)))
print('Classification Report:')
print(classification_report(y_test, y_pred, labels=labels, target_names=le.classes_))
print('Confusion Matrix:')
print(confusion_matrix(y_test, y_pred, labels=labels))

# Save model
import joblib
joblib.dump(clf, 'ML/model/pre-assessment.joblib')
print('Model saved as pre-assess.joblib')
