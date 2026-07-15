{
  '顶部导航': {
    layout: 'horizontal',
    children: [
      {
        '左侧': {
          description: '图标+文字 iMaster Pro'
        }
      },
      {
        '居中': {
          description: '导航菜单: 概览 | 节点管理 | 拓扑列表 | 性能监控 | 外部接入 | 规则配置 | 日志分析'
        }
      },
      {
        '右侧': {
          description: '设置图标 | 界面视图控制图标 | 用户个人图标(靠右边缘)'
        }
      }
    ]
  },
  '导航栏下方信息行': {
    layout: 'horizontal',
    children: [
      {
        '左侧': {
          description: '全局页面标题: 网络运行总览'
        }
      },
      {
        '右侧': {
          description: '系统时间: 2026-05-27 14:30:00 + 告警监控图标'
        }
      }
    ]
  },
  '主内容区': {
    layout: 'horizontal',
    children: [
      {
        '左侧主内容区域': {
          layout: 'vertical',
          children: [
            {
              'Tab导航': {
                description: '核心路由 | 边缘网关 | 接入层'
              }
            },
            {
              'CPU使用率': {
                layout: 'horizontal',
                children: [
                  {
                    '左侧30%': {
                      description: 'PatGauge仪表盘'
                    }
                  },
                  {
                    '右侧70%': {
                      layout: 'horizontal',
                      children: [
                        {
                          '统计块1': {
                            description: '图标+文本(左右排列,图标和字体较大) 数值1574 运行中'
                          }
                        },
                        {
                          '统计块2': {
                            description: '图标+文本(左右排列,图标和字体较大) 数值050 待检修'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              '网络流量趋势': {
                layout: 'vertical',
                children: [
                  {
                    '上行': {
                      layout: 'horizontal',
                      children: [
                        {
                          '左侧': {
                            description: '标题: 网络流量趋势'
                          }
                        },
                        {
                          '右侧': {
                            description: '下拉控件: 近30天'
                          }
                        }
                      ]
                    }
                  },
                  {
                    '下行': {
                      description: '折线图(单条数据,占满模块宽度)'
                    }
                  }
                ]
              }
            },
            {
              '小型图表组': {
                layout: 'horizontal',
                children: [
                  {
                    '计算资源池监控': {
                      description: '堆叠折线图: 核心集群>84% | 高频区6%~09% | 闲置区'
                    }
                  },
                  {
                    '存储容量使用趋势': {
                      description: '堆叠折线图: 固态存储>58% | 机械硬盘2%~14% | 备份区'
                    }
                  },
                  {
                    '网络IO流量监控': {
                      description: '堆叠折线图: 下行流量>63% | 上行流量5%~12% | 广播包'
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        '右侧侧边区域': {
          width: '400px',
          children: [
            {
              '统计概览面板': {
                children: [
                  {
                    '标题': {
                      description: '设备在线数(6119) | 异常告警(766)'
                    }
                  },
                  {
                    '大字数值': {
                      description: '6415 总数'
                    }
                  },
                  {
                    '堆叠条形图': {
                      description: 'PatStackedBar'
                    }
                  }
                ]
              }
            },
            {
              '多层级列表面板': {
                children: [
                  {
                    '标题': {
                      description: '区域流量排行(TOP 27)｜异常节点追踪(处理中28)'
                    }
                  },
                  {
                    '卡片容器': {
                      children: [
                        {
                          '行左侧': {
                            description: '彩色圆角图标 + 文本标题(部分标题右侧跟随?提示图标)'
                          }
                        },
                        {
                          '行右侧': {
                            description: '2组数据集合(中间用分割线隔开),每组上下结构(上方重点数值,下方灰字标签)'
                          }
                        }
                      ]
                    }
                  },
                  {
                    '管理节点': {
                      children: [
                        { '主控服务器': { description: '296 当前连接 | 9902 总吞吐量' } },
                        { '备用控制节点': { description: '68 活跃会话 | 7613 写入数据' } },
                        { '安全网关': { description: '88 拦截次数 | 3579 并发数' } },
                        { '负载均衡器': { description: '8 异常转发 | 9498 总分配量' } }
                      ]
                    }
                  },
                  {
                    '转发节点': {
                      children: [
                        { '专线接入集群': { description: '57 并发请求 | 2560 数据包量' } },
                        { '公网接入集群': { description: '99 当前带宽 | 0347 丢包率' } }
                      ]
                    }
                  },
                  {
                    '数据节点': {
                      children: [
                        { '主数据库': { description: '3 查询延迟 | 5877 IOPS' } }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
}
