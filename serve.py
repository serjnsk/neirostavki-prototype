"""Локальный сервер для просмотра прототипа без кэша.

Запуск из папки проекта:  python3 serve.py   →  http://127.0.0.1:8765
Остановка: Ctrl-C. Заголовок no-store нужен, чтобы браузер сразу видел правки CSS и JS.
"""
import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()


if __name__ == '__main__':
    print(f'Нейроставки: http://127.0.0.1:{PORT}  (Ctrl-C — остановить)', flush=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(NoCacheHandler, directory=ROOT))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
