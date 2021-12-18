---
title: Overview
layout: default.njk
---

<style>

.overview-table{
  width: 100%;
  max-width: 940px;
  padding: 1rem;
  table-layout: fixed;
  border-spacing: 0;
}

.overview-table tr:nth-child(even) {
  background-color: rgba(0,0,0,0.1)
}

.overview-table td{
  font-size: 12px;
  padding: 3px;
}

.overview-table .img,
.overview-table .img img{
  width: 60px;
  height: 60px;
}

.overview-table .img img{
  object-fit: contain;
}

.overview-table .count{
  width: 3rem;
}

.overview-table .title{
  width: 50%;
}

.overview-table .id{
  width: 12rem;
}



</style>

<table class="overview-table">
{%- for item in collections.paintingsDE -%}
  <tr>
    <td class="count">{{loop.index}}</td>
    <td class="img"><a href="../../de/paintings/{{item.metadata.id}}"><img src="{{item.metadata.imgSrc}}"></a></td>
    <td class="id">{{item.metadata.id}}</td>
    <td class="title">{{item.metadata.title}}</td>
    <td class="sorting-number">{{item.sortingNumber}}</td>
    <td class="info"></td>
  </tr>
{%- endfor -%}
</table>

<table class="overview-table">
{%- for item in collections.graphicsVirtualObjectsDE -%}
  <tr>
    <td class="count">{{loop.index}}</td>
    <td class="img"><a href="../../de/graphics/{{item.metadata.id}}"><img src="{{item.metadata.imgSrc}}"></a></td>
    <td class="id">{{item.metadata.id}}</td>
    <td class="title">{{item.metadata.title}}</td>
    <td class="sorting-number">{{item.sortingNumber}}</td>
    <td class="info">{{item.references.reprints.length}}</td>
  </tr>
{%- endfor -%}
</table>
