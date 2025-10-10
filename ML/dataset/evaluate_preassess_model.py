import pandas as pd
import joblib
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Load dataset
csv_path = 'ML/dataset/pre-assesment.csv'
df = pd.read_csv(csv_path)

# Features to use (exclude non-numeric, target, and any not present)
exclude_cols = ['id_number','student_name','year_graduated','OJT Placement']
feature_cols = [col for col in df.columns if col not in exclude_cols]
X = df[feature_cols].apply(pd.to_numeric, errors='coerce').fillna(0)

# Encode target variable
le = LabelEncoder()
y_true = le.fit_transform(df['OJT Placement'])

# Load trained model
model_path = 'ML/model/pre-assess.joblib'
clf = joblib.load(model_path)

# Predict
y_pred = clf.predict(X)

# Print actual vs predicted placements
actual = le.inverse_transform(y_true)
predicted = le.inverse_transform(y_pred)
results_df = pd.DataFrame({'Actual': actual, 'Predicted': predicted})
print(results_df.head(20))  # Show first 20 for brevity

# Print classification report and confusion matrix
print('\nClassification Report:')
print(classification_report(y_true, y_pred, target_names=le.classes_))
print('Confusion Matrix:')
print(confusion_matrix(y_true, y_pred))
