<<<<<<< HEAD
{% if theme.theme.fancybox %}
  {% set fancybox_js = 'fancybox/jquery.fancybox.pack.js' %}
{% endif %}

{%
  set js_libs = {
    jquery: 'jquery/jquery-3.1.1.min.js',
    slideout: 'slideout/slideout.js',
    fancybox: fancybox_js
=======
{% if theme.fancybox %}
  {% set fancybox_js = 'fancybox/jquery.fancybox.pack.js' %}
{% endif %}

{% if theme.pjax %}
  {% set pjax_js = 'pjax/jquery.pjax.min.js' %}
  {% set nprogress_js = 'nprogress/nprogress.min.js' %}
{% endif %}

{%
  set js_libs = {
    jquery: 'jquery/jquery.min.js',
    slideout: 'slideout/slideout.js',
    fancybox: fancybox_js,
    pjax: pjax_js,
    nprogress: nprogress_js,
>>>>>>> f897cd88f3de76238b98270a86d50dcdaa906d02
  }
%}

{% for lib in js_libs %}
  {% if lib %}
    <script type="text/javascript" src="{{ url_for('lib') }}/{{ lib }}"></script>
  {% endif %}
{% endfor %}
