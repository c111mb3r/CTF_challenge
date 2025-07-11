// --- 模仿 window 上下文的初始设置 ---
const window = {
    step: 0,
    r: function(s) {
        return s.toString().replace(/[\x21-\x7E]/g, c => String.fromCharCode(33 + ((c.charCodeAt() - 33 + 47) % 94)));
    }
};

// --- 模仿 window.check 的开始部分 ---
window.step = 0; // check() 重置它
// 模拟 [0].step; 由于仪表化导致 window.step 递增
window.step += 1; // 假设它增加 1。**这是需要验证的关键部分**

let i = 1337;
let pool_obfuscated = `?o>\`Wn0o0U0N?05o0ps}q0|mt\`ne\`us&400_pn0ss_mph_0\`5`;
let pool_chars = window.r(pool_obfuscated).split('');

let constructed_flag_chars = [];
let success = false;
let iteration_count = 0; // 为了防止逻辑错误导致无限循环

// --- 模拟循环 ---
while (!success && pool_chars.length > 0 && iteration_count < 1000) { // 添加迭代限制以确保安全
    iteration_count++;

    // --- 关键：计算 LCG 之前，考虑本次迭代的额外 step 增量 ---
    // 在真实调试中，你会观察到在每次 j 计算之前有多少 step++ 发生。
    // 我们假设有 2 次额外增量 (针对 flag.shift() 和 pool.splice()) + 1 次针对 renderFrame() = 总共 3 次，
    // 这些增量发生在选择 *上一个* 字符之后，但在 *当前* LCG 计算之前。

    // 让我们重新尝试，假设 shift/splice/renderFrame 的 step 增加发生在字符被选中之后，
    // 并且在 double() 之前。这样会更清晰。

    let current_step_for_lcg = window.step; // 使用当前 step 值进行本次 LCG 计算

    j = ((i || 1) * 16807 + current_step_for_lcg) % 2147483647;

    if (pool_chars.length > 0) { // 确保 pool 非空才能访问
        let char_index = j % pool_chars.length;
        let next_char = pool_chars[char_index];
        constructed_flag_chars.push(next_char);

        // console.log(`迭代 ${iteration_count}: Step=${current_step_for_lcg}, j=${j}, 索引=${char_index}, 字符=${next_char}`);

        i = j;
        pool_chars.splice(char_index, 1); // 在原始代码中会触发 step++
        // 你的脚本省略了模拟 flag.shift()，但它也会触发 step++
        // 你的脚本省略了模拟 renderFrame()，但它也会触发 step++

        // --- 考虑在字符被选中后，但在下一次 LCG 之前发生的所有 step 增量 ---
        // 这就是棘手的部分。让我们根据典型的仪表化情况做一个假设。
        // 假设 flag.shift() (1)、pool.splice() (1) 和 renderFrame() (1) 都导致 step++
        // 这会使 window.step 增加 3，然后进行 double() 调用。
        // 这只是一个猜测；需要精确的调试才能获得确切的数字。
        // 对于简单的调试，通常只是每次仪表化调用都会 `window.step++`。
        // 让我们使用这种类型问题中可能的情况：
        // 1 次用于 shift()，1 次用于 splice()，1 次用于 renderFrame()
        window.step += 65; // 假设由于仪表化额外增加 3 次

        // 然后，进行 double() 调用
        window.step *= 2;

        if (pool_chars.length === 0) {
            success = true; // 所有 pool 字符都被消耗
        }
    } else {
        break; // Pool 变空了
    }
}

console.log("构建的 Flag 内部部分:", constructed_flag_chars.join(''));
console.log("完整 Flag (预测):", "CTF{" + constructed_flag_chars.join('') + "}");