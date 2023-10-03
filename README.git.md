# ZMP-CLI
CLI dùng để start, build, deploy Zalo Mini App

## Contribute
Project bao gồm các nhánh:
- master: nhánh chính tương ứng với version đang release
- develop: nhánh chính, source code mới nhất bao gồm các tính năng chuẩn bị cho lần release tiếp theo
- feature/*: nhánh tương ứng với chức năng đang phát triển (xoá sau khi hoàn thành)
- release/*-rc: nhánh tương ứng với các release candidate (xoá sau khi hoàn thành)
- hotfix/*: nhánh tương ứng với bug cần fix cho version đang release (xoá sau khi hoàn thành)

Suggest sử dụng git flow để quản lí các nhánh:
1. Cài đặt và tìm hiểu git flow theo [hướng dẫn](https://danielkummer.github.io/git-flow-cheatsheet/index.vi_VN.html)
2. Init git flow tương ứng với các branch trên: ```git flow init```

Phát triển một tính năng mới:
1. Để bắt đầu code tính năng mới: ```git flow feature start feature_1```
2. Sau khi code và test xong: ```git flow feature finish feature_1```, tính năng sẽ được merge vào nhánh develop

Tạo một release candidate (suffix "-rc"):
1. ```git flow release start <major>.<minor>.<patch>-rc```
2. Sau khi test xong: ```git flow release finish <major>.<minor>.<patch>-rc```, tính năng sẽ được merge vào nhánh master để chờ release và nhánh develop

Để fix bug trên bản release:
1. ```git flow hotfix start bug-a```
2. Sau khi fix xong: ```git flow hotfix finish bug-a```, tính năng sẽ được merge vào nhánh master để chờ release và nhánh develop

Để fix bug trên bản release-candidate:
1. Tạo nhánh mới từ nhánh rc muốn fix với refix: ```git branch ```
2. Sau khi fix xong: ```git flow hotfix finish bug-a```, tính năng sẽ được merge vào nhánh master để chờ release và nhánh develop

Để release nhánh master:
1. ```npm run release```
2. Nhập version:
   - patch: fix bug
   - minor: thêm tính năng
   - major: thay đổi lớn có ảnh hưởng tới version cũ
