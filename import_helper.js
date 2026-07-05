// One-time import script: loads JSON and adds it to localStorage, then reloads
(async () => {
    try {
        const resp = await fetch('./计算机网络复习.json');
        const questions = await resp.json();
        
        // Read existing data
        const stored = localStorage.getItem('quiz_system_data');
        const data = stored ? JSON.parse(stored) : { banks: [] };
        
        // Check if already imported
        const existingBank = data.banks.find(b => b.name === '计算机网络复习');
        if (existingBank) {
            document.title = '已存在，跳过导入';
            return;
        }
        
        // Add new bank
        const newBank = {
            id: 'bank_' + Date.now(),
            name: '计算机网络复习',
            createdAt: new Date().toISOString(),
            questions: questions
        };
        
        data.banks.push(newBank);
        localStorage.setItem('quiz_system_data', JSON.stringify(data));
        
        document.title = '导入成功：' + questions.length + '道题';
    } catch (e) {
        document.title = '导入失败：' + e.message;
    }
})();
