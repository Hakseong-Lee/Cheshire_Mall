(() => {
	'use strict';
	const e = (e) => {
		const a = e.split(' '),
			o = document.querySelector('#navbar'),
			t = !!localStorage.getItem('token'),
			c = !!localStorage.getItem('admin'),
			n = {
				register: '<li><a href="/register">회원가입</a></li>',
				login: '<li><a href="/login">로그인</a></li>',
			},
			r = {
				account: '<li><a href="/account">계정관리</a></li>',
				logout: '<li><a href="#" id="logout">로그아웃</a></li>',
				productAdd: '<li><a href="/product/add">제품 추가</a></li>',
				categoryAdd: '<li><a href="/category/add">카테고리 추가</a></li>',
			},
			i = { admin: '<li><a href="/admin">페이지관리</a></li>' },
			l = document.createElement('script');
		l.innerText =
			"\n      const logoutElem = document.querySelector('#logout'); \n      \n      if (logoutElem) {\n        logoutElem.addEventListener('click', () => {\n          localStorage.removeItem('token');\n          localStorage.removeItem('admin');\n\n          window.location.href = '/';\n        });\n      }\n  ";
		let d = '';
		for (const e of a)
			c && (d += i[e] ?? ''), (d += t ? r[e] ?? '' : n[e] ?? '');
		o.insertAdjacentHTML('afterbegin', d), o.after(l);
	};
	(() => {
		if (!localStorage.getItem('token')) {
			const e = window.location.pathname,
				a = window.location.search;
			window.location.replace(`/login?previouspage=${e + a}`);
		}
	})(),
		(() => {
			switch (window.location.pathname) {
				case '/':
				case '/cart/':
				case '/product/detail/':
				case '/product/list/':
					e('admin register login account logout');
					break;
				case '/account/orders/':
				case '/account/security/':
				case '/account/signout/':
				case '/admin/orders/':
				case '/admin/users/':
				case '/order/complete/':
				case '/order/':
				case '/product/add/':
					e('admin account logout');
					break;
				case '/account/':
					e('admin logout');
					break;
				case '/admin/':
					e('account logout');
					break;
				case '/category/add/':
					e('admin account productAdd logout');
					break;
				case '/login/':
					e('register');
					break;
				case '/register/':
					e('login');
			}
		})();
})();
