import re
with open('c:/ERP/src/components/trims-store/trims-grn-form.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\{\/\* Load PO Items Dialog \*\/}.*?<\/Dialog>', '', content, flags=re.DOTALL)
with open('c:/ERP/src/components/trims-store/trims-grn-form.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
