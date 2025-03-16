import json
import re
import requests
import hashlib
import os

def download_metadata(url):
    """下载最新的 metadata.json 文件并返回内容"""
    response = requests.get(url)
    if response.status_code == 200:
        print("文件已成功下载")
        return response.text
    else:
        raise Exception(f"无法下载文件，状态码: {response.status_code}")

def calculate_content_hash(content):
    """计算内容的 SHA-256 哈希值"""
    sha256 = hashlib.sha256()
    sha256.update(content.encode('utf-8'))
    return sha256.hexdigest()

def metadata_has_changed(content, hash_file_path):
    """检查 metadata.json 内容是否更新"""
    current_hash = calculate_content_hash(content)

    # 检查是否存在之前的哈希文件
    if os.path.exists(hash_file_path):
        with open(hash_file_path, 'r') as hash_file:
            previous_hash = hash_file.read().strip()
        # 比较哈希值
        if current_hash == previous_hash:
            print("metadata.json 文件没有变化")
            return False  # 没有变化

    # 若文件不存在或哈希值有变化，则更新哈希文件
    with open(hash_file_path, 'w') as hash_file:
        hash_file.write(current_hash)
    print("metadata.json 文件有变化")
    return True  # 文件有变化

def extract_gStaticUrl(content):
    """提取 gStaticUrl 链接并返回链接列表"""
    data = json.loads(content)
    urls = []
    # 递归查找所有 gStaticUrl 键
    def find_urls(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "gStaticUrl" and isinstance(value, str):
                    urls.append(value)
                elif isinstance(value, (dict, list)):
                    find_urls(value)
        elif isinstance(obj, list):
            for item in obj:
                find_urls(item)
    
    find_urls(data)
    print(f"共提取到 {len(urls)} 个链接")
    return urls

def process_emoji_urls(urls):
    """一次性处理 URL，直接生成最终简化的数据结构"""
    base_url = "https://www.gstatic.com/android/keyboard/emojikitchen/"
    
    # 按日期和路径整理数据
    emoji_dict = {}
    for url in urls:
        emoji_path = url.replace(base_url, "")
        match = re.match(r"^(\d{8})/(.+)$", emoji_path)
        if match:
            date, emoji_name = match.groups()
            if emoji_name not in emoji_dict:
                emoji_dict[emoji_name] = {"date": date, "path": emoji_path}
            elif date > emoji_dict[emoji_name]["date"]:
                emoji_dict[emoji_name] = {"date": date, "path": emoji_path}
    
    # 获取并排序唯一日期
    unique_dates = sorted(set(item["date"] for item in emoji_dict.values()))
    date_index_map = {date: index for index, date in enumerate(unique_dates)}
    
    # 构建最终数据结构
    result = {
        "baseUrl": base_url,
        "dates": unique_dates,
        "emojis": {str(i): [] for i in range(len(unique_dates))}
    }
    
    # 填充数据 - 去掉.png后缀
    for item in emoji_dict.values():
        date = item["date"]
        emoji_name = item["path"].split("/")[-1]
        # 移除.png后缀
        emoji_name_no_ext = emoji_name[:-4] if emoji_name.endswith(".png") else emoji_name
        date_index = date_index_map[date]
        result["emojis"][str(date_index)].append(emoji_name_no_ext)
    
    return result

# 自动更新流程
def main():
    # 文件路径和 URL
    metadata_url = "https://raw.githubusercontent.com/xsalazar/emoji-kitchen-backend/main/app/metadata.json"
    hash_file_path = "data/metadata_hash.txt"
    output_path = "data/emojimix_data.json"

    # 下载 metadata.json 内容
    content = download_metadata(metadata_url)

    # 检查 metadata.json 是否有更新
    if not metadata_has_changed(content, hash_file_path):
        print("文件内容未变动，跳过更新步骤")
        return  # 如果没有更新，退出程序

    # 如果文件有变化，继续执行以下处理
    urls = extract_gStaticUrl(content)
    simplified_data = process_emoji_urls(urls)

    # 保存最终简化后的数据
    with open(output_path, 'w', encoding='utf-8') as output_file:
        json.dump(simplified_data, output_file, ensure_ascii=False, indent=4)
    print(f"最终的简化数据已保存到 {output_path}")

# 运行自动更新脚本
if __name__ == "__main__":
    main()
