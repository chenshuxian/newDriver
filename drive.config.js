module.exports = {
	apps: [
		{
			name: 'drive_km',
			script: './server.js',
			cwd: './', // 當前工作路徑
			watch: [
				'.next', // 監控變化的目錄，一旦變化，自動重啟
			],
			ignore_watch: [
				// 從監控目錄中排除
				'node_modules',
				'logs',
				'static',
			],
			instances: 2, // 啟動2個實例
			node_args: '--harmony',
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
			out_file: './logs/out.log', // 普通日誌路徑
			error_file: './logs/err.log', // 錯誤日誌路徑
			merge_logs: true,
			log_date_format: 'YYYY-MM-DD HH:mm Z', // 設置日誌的日期格式
		},
	],
};
