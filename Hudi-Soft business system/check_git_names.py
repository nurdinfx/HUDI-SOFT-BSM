import subprocess

def get_tree():
    result = subprocess.run(['git', 'ls-tree', 'main'], capture_output=True, text=False)
    lines = result.stdout.split(b'\n')
    for line in lines:
        if line:
            parts = line.split(b'\t')
            if len(parts) > 1:
                name = parts[1]
                print(f"Name: {name}, Bytes: {list(name)}")

if __name__ == "__main__":
    get_tree()
