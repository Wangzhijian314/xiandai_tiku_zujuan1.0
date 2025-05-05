import re
import json

# 读取LaTeX文件
with open('questions.tex', 'r', encoding='utf-8') as f:
    latex_text = f.read()

# 找到所有题目
pattern = re.compile(
    r'\\begin{question}\s*\{(.*?)\}\s*\{(.*?)\}\s*\{(.*?)\}\s*\{(.*?)\}\s*\{(.*?)\}\s*\\end{question}',
    re.DOTALL
)

questions = []
for match in pattern.finditer(latex_text):
    q_type, topic, nandu , content, explanation = match.groups()


    # 替换 $$...$$ 为 \[...\] 
    content = re.sub(r'(?<!\\)\$\$(.*?)(?<!\\)\$\$', r'\\[\1\\]', content)
    # 替换 $...$ 为 \(...\)
    content = re.sub(r'(?<!\\)\$(.*?)(?<!\\)\$', r'\\(\1\\)', content)
    # 删除制表符 \t（或替换为空格）
    content = content.replace('\t', ' ')
    # 替换 \quad 为 &nbsp
    content = re.sub(r'\\quad', '&nbsp;', content )
    # 替换 $$...$$ 为 \[...\]
    explanation = re.sub(r'(?<!\\)\$\$(.*?)(?<!\\)\$\$', r'\\[\1\\]', explanation)
    # 替换 $...$ 为 \(...\) 
    explanation = re.sub(r'(?<!\\)\$(.*?)(?<!\\)\$', r'\\(\1\\)', explanation)

    questions.append({
        "type": q_type.strip(),
        "topic": topic.strip(),
        "nandu": nandu.strip(),
        "content": content.strip(),
        "explanation": explanation.strip()
    })

# 保存为JSON文件
with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("成功生成 questions.json！")
