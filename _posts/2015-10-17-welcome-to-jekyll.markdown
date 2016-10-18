---
layout: post
title:  "Hello!"
date:   2015-10-17 13:00:14
categories: jekyll update
docurl: assets/Tirlapur_Mallikarjun_Cover_Letter_and_CV.pdf
---
<ul>
  {% for post in site.posts %}
    {% if post.docurl %}
      <li><a href="{{ site.baseurl }}{{ post.docurl }}">{{ post.title }}</a></li>
    {% else %}
      <li><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></li>
    {% endif %}
    {{ post.excerpt }}
  {% endfor %}
</ul>

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll’s dedicated Help repository][jekyll-help].

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
