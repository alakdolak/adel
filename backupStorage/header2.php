<!DOCTYPE html>
<!--[if IE 6]>
<html id="ie6" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 7]>
<html id="ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html id="ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<?php elegant_description(); ?>
	<?php elegant_keywords(); ?>
	<?php elegant_canonical(); ?>

	<?php do_action( 'et_head_meta' ); ?>

	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

	<?php $template_directory_uri = get_template_directory_uri(); ?>
	<!--[if lt IE 9]>
	<script src="<?php echo esc_url( $template_directory_uri . '/js/html5.js"' ); ?>" type="text/javascript"></script>
	<![endif]-->

	<script type="text/javascript">
		document.documentElement.className = 'js';
	</script>

	<?php wp_head(); ?>

<!--افزودن کد پشتیبانی آنلاین
<script type="text/javascript">
var LHCChatOptions = {};
LHCChatOptions.opt = {widget_height:340,widget_width:300,popup_height:520,popup_width:500};
		 LHCChatOptions.attr_prefill = new Array();
LHCChatOptions.attr_prefill.push({'name':'email','value':'<?php global $current_user; wp_get_current_user(); echo $current_user->user_email ;?>','hidden':true});
LHCChatOptions.attr_prefill.push({'name':'username','value':'<?php global $current_user; wp_get_current_user(); echo $current_user->user_firstname . ' ' . $current_user->user_lastname ;?>','hidden':true});
		
LHCChatOptions.attr_prefill_admin = new Array();
LHCChatOptions.attr_prefill_admin.push({'index':'0','value':'<?php global $current_user; wp_get_current_user(); echo $current_user->user_login ;?>','hidden':true});
(function() {
var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
var referrer = (document.referrer) ? encodeURIComponent(document.referrer.substr(document.referrer.indexOf('://')+1)) : '';
var location  = (document.location) ? encodeURIComponent(window.location.href.substring(window.location.protocol.length)) : '';
po.src = '//ppltest.ut.ac.ir/lhc/index.php/chat/getstatus/(click)/internal/(position)/bottom_right/(ma)/br/(top)/50/(units)/pixels/(leaveamessage)/true/(department)/1/(theme)/2?r='+referrer+'&l='+location;
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();
</script>
-->
	<!-- کد منوی کاربری-->
<script>
jQuery(document).ready(function(){
	    jQuery(".user-menu").mouseenter(function(){
        jQuery(".user-menu-box").slideDown("fast");
    });
    jQuery(".user-menu").mouseleave(function(){
        jQuery(".user-menu-box").slideUp("fast");
    });

});
</script>

<!--افزودن کد های آقای محمدیان-->
  <link href="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/myStyleSheet.css?v=1.06" rel="stylesheet">
    <link href="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/imageviewer.css?v=1.06" rel="stylesheet">

<style>
.data-header {
    font-weight: 700 !important;
    font-size: 14px !important;
    color: #333 !important;
}
</style>

    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/iframeScript.js?v=1.03"></script>
    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/myScriptLangFaDemo.js?v=2.30.01"></script>
    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/myScript.js?v=2.2.31.24"></script>
    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/onReadyDoFaDemo.js?v=2.2.31.26"></script>
    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://ppl.ut.ac.ir/demo/wp-content/diagram-content/ITUT/content/imageviewer.js?v=1.03"></script>
</head>
<body <?php body_class(); ?>>
<?php
	$product_tour_enabled = et_builder_is_product_tour_enabled();
	$page_container_style = $product_tour_enabled ? ' style="padding-top: 0px;"' : ''; ?>
	<div id="page-container"<?php echo $page_container_style; ?>>
<?php
	if ( $product_tour_enabled || is_page_template( 'page-template-blank.php' ) ) {
		return;
	}

	$et_secondary_nav_items = et_divi_get_top_nav_items();

	$et_phone_number = $et_secondary_nav_items->phone_number;

	$et_email = $et_secondary_nav_items->email;

	$et_contact_info_defined = $et_secondary_nav_items->contact_info_defined;

	$show_header_social_icons = $et_secondary_nav_items->show_header_social_icons;

	$et_secondary_nav = $et_secondary_nav_items->secondary_nav;

	$et_top_info_defined = $et_secondary_nav_items->top_info_defined;

	$et_slide_header = 'slide' === et_get_option( 'header_style', 'left' ) || 'fullscreen' === et_get_option( 'header_style', 'left' ) ? true : false;
?>

	<?php if ( $et_top_info_defined && ! $et_slide_header || is_customize_preview() ) : ?>
		<div id="top-header"<?php echo $et_top_info_defined ? '' : 'style="display: none;"'; ?>>
			<div class="container clearfix">

			<?php if ( $et_contact_info_defined ) : ?>

				<div id="et-info">
				<?php if ( '' !== ( $et_phone_number = et_get_option( 'phone_number' ) ) ) : ?>
					<span id="et-info-phone"><?php echo et_sanitize_html_input_text( $et_phone_number ); ?></span>
				<?php endif; ?>

				<?php if ( '' !== ( $et_email = et_get_option( 'header_email' ) ) ) : ?>
					<a href="<?php echo esc_attr( 'mailto:' . $et_email ); ?>"><span id="et-info-email"><?php echo esc_html( $et_email ); ?></span></a>
				<?php endif; ?>

				<?php
				if ( true === $show_header_social_icons ) {
					get_template_part( 'includes/social_icons', 'header' );
				} ?>
				</div> <!-- #et-info -->

			<?php endif; // true === $et_contact_info_defined ?>

				<div id="et-secondary-menu">
				<?php
					if ( ! $et_contact_info_defined && true === $show_header_social_icons ) {
						get_template_part( 'includes/social_icons', 'header' );
					} else if ( $et_contact_info_defined && true === $show_header_social_icons ) {
						ob_start();

						get_template_part( 'includes/social_icons', 'header' );

						$duplicate_social_icons = ob_get_contents();

						ob_end_clean();

						printf(
							'<div class="et_duplicate_social_icons">
								%1$s
							</div>',
							$duplicate_social_icons
						);
					}

					if ( '' !== $et_secondary_nav ) {
						echo $et_secondary_nav;
					}

					et_show_cart_total();
				?>
<div class="user-menu" >
				 <?php 

// افزودن خوش آمد گویی بالای سایت

      if ( is_user_logged_in() ):
            $current_user = wp_get_current_user();

        if ( ($current_user instanceof WP_User) ) {
           // echo get_avatar( $current_user->user_email, 20 );
            echo ' <span id="welcome-user"> '.$current_user->user_login .' </span>' ;
        }
        endif;

    ?>
<!-- افزودن منوی کاربری -->
<div class="user-menu-box" style="display:none;">

 <?php  	wp_nav_menu( array( 'theme_location' => 'user-menu', 'container' =>'', 'menu_class' =>'usernav' ) );  ?>

</div>
</div>
				</div> <!-- #et-secondary-menu -->

			</div> <!-- .container -->
			
<?php include "mega-menu.php"; ?>			
			
			
		</div> <!-- #top-header -->
	<?php endif; // true ==== $et_top_info_defined ?>

	<?php if ( $et_slide_header || is_customize_preview() ) : ?>
		<div class="et_slide_in_menu_container">
			<?php if ( 'fullscreen' === et_get_option( 'header_style', 'left' ) || is_customize_preview() ) { ?>
				<span class="mobile_menu_bar et_toggle_fullscreen_menu"></span>
			<?php } ?>

			<?php
				if ( $et_contact_info_defined || true === $show_header_social_icons || false !== et_get_option( 'show_search_icon', true ) || class_exists( 'woocommerce' ) || is_customize_preview() ) { ?>
					<div class="et_slide_menu_top">

					<?php if ( 'fullscreen' === et_get_option( 'header_style', 'left' ) ) { ?>
						<div class="et_pb_top_menu_inner">
					<?php } ?>
			<?php }

				if ( true === $show_header_social_icons ) {
					get_template_part( 'includes/social_icons', 'header' );
				}

				et_show_cart_total();
			?>
			<?php if ( false !== et_get_option( 'show_search_icon', true ) || is_customize_preview() ) : ?>
				<?php if ( 'fullscreen' !== et_get_option( 'header_style', 'left' ) ) { ?>
					<div class="clear"></div>
				<?php } ?>
				<form role="search" method="get" class="et-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php
						printf( '<input type="search" class="et-search-field" placeholder="%1$s" value="%2$s" name="s" title="%3$s" />',
							esc_attr__( 'Search &hellip;', 'Divi' ),
							get_search_query(),
							esc_attr__( 'Search for:', 'Divi' )
						);
					?>
					<button type="submit" id="searchsubmit_header"></button>
				</form>
			<?php endif; // true === et_get_option( 'show_search_icon', false ) ?>

			<?php if ( $et_contact_info_defined ) : ?>

				<div id="et-info">
				<?php if ( '' !== ( $et_phone_number = et_get_option( 'phone_number' ) ) ) : ?>
					<span id="et-info-phone"><?php echo et_sanitize_html_input_text( $et_phone_number ); ?></span>
				<?php endif; ?>

				<?php if ( '' !== ( $et_email = et_get_option( 'header_email' ) ) ) : ?>
					<a href="<?php echo esc_attr( 'mailto:' . $et_email ); ?>"><span id="et-info-email"><?php echo esc_html( $et_email ); ?></span></a>
				<?php endif; ?>
				</div> <!-- #et-info -->

			<?php endif; // true === $et_contact_info_defined ?>
			<?php if ( $et_contact_info_defined || true === $show_header_social_icons || false !== et_get_option( 'show_search_icon', true ) || class_exists( 'woocommerce' ) || is_customize_preview() ) { ?>
				<?php if ( 'fullscreen' === et_get_option( 'header_style', 'left' ) ) { ?>
					</div> <!-- .et_pb_top_menu_inner -->
				<?php } ?>

				</div> <!-- .et_slide_menu_top -->
			<?php } ?>

			<div class="et_pb_fullscreen_nav_container">
				<?php
					$slide_nav = '';
					$slide_menu_class = 'et_mobile_menu';

					$slide_nav = wp_nav_menu( array( 'theme_location' => 'primary-menu', 'container' => '', 'fallback_cb' => '', 'echo' => false, 'items_wrap' => '%3$s' ) );
					$slide_nav .= wp_nav_menu( array( 'theme_location' => 'secondary-menu', 'container' => '', 'fallback_cb' => '', 'echo' => false, 'items_wrap' => '%3$s' ) );
				?>

				<ul id="mobile_menu_slide" class="<?php echo esc_attr( $slide_menu_class ); ?>">

				<?php
					if ( '' == $slide_nav ) :
				?>
						<?php if ( 'on' == et_get_option( 'divi_home_link' ) ) { ?>
							<li <?php if ( is_home() ) echo( 'class="current_page_item"' ); ?>><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'Divi' ); ?></a></li>
						<?php }; ?>

						<?php show_page_menu( $slide_menu_class, false, false ); ?>
						<?php show_categories_menu( $slide_menu_class, false ); ?>
				<?php
					else :
						echo( $slide_nav );
					endif;
				?>

				</ul>
			</div>
		</div>
	<?php endif; // true ==== $et_slide_header ?>

		<header id="main-header" data-height-onload="<?php echo esc_attr( et_get_option( 'menu_height', '66' ) ); ?>">
			<div class="container clearfix et_menu_container">
			<?php
				$logo = ( $user_logo = et_get_option( 'divi_logo' ) ) && '' != $user_logo
					? $user_logo
					: $template_directory_uri . '/images/logo.png';
			?>
				<div class="logo_container">
					<span class="logo_helper"></span>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<img src="<?php echo esc_attr( $logo ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" id="logo" data-height-percentage="<?php echo esc_attr( et_get_option( 'logo_height', '54' ) ); ?>" />
					</a>
				</div>

				<div id="et-top-navigation" data-height="<?php echo esc_attr( et_get_option( 'menu_height', '66' ) ); ?>" data-fixed-height="<?php echo esc_attr( et_get_option( 'minimized_menu_height', '40' ) ); ?>">
					<?php if ( ! $et_slide_header || is_customize_preview() ) : ?>
						<nav id="top-menu-nav">
						<?php include 'mega_menu.php'; ?>
										<!--
						<?php
							$menuClass = 'nav';
							if ( 'on' == et_get_option( 'divi_disable_toptier' ) ) $menuClass .= ' et_disable_top_tier';
							$primaryNav = '';

							$primaryNav = wp_nav_menu( array( 'theme_location' => 'primary-menu', 'container' => '', 'fallback_cb' => '', 'menu_class' => $menuClass, 'menu_id' => 'top-menu', 'echo' => false ) );

							if ( '' == $primaryNav ) :
						?>
							<ul id="top-menu" class="<?php echo esc_attr( $menuClass ); ?>">
								<?php if ( 'on' == et_get_option( 'divi_home_link' ) ) { ?>
									<li <?php if ( is_home() ) echo( 'class="current_page_item"' ); ?>><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'Divi' ); ?></a></li>
								<?php }; ?>

								<?php show_page_menu( $menuClass, false, false ); ?>
								<?php show_categories_menu( $menuClass, false ); ?>
							</ul>

						<?php
							else :
								echo( $primaryNav );
							endif;
						?>


						</nav>



					<?php endif; ?>

					<?php
					if ( ! $et_top_info_defined && ( ! $et_slide_header || is_customize_preview() ) ) {
						et_show_cart_total( array(
							'no_text' => true,
						) );
					}
					?>


					<?php if ( $et_slide_header || is_customize_preview() ) : ?>
						<span class="mobile_menu_bar et_pb_header_toggle et_toggle_<?php echo esc_attr( et_get_option( 'header_style', 'left' ) ); ?>_menu"></span>
					<?php endif; ?>

					<?php if ( ( false !== et_get_option( 'show_search_icon', true ) && ! $et_slide_header ) || is_customize_preview() ) : ?>
					<div id="et_top_search">
						<span id="et_search_icon"></span>
					</div>
					<?php endif; // true === et_get_option( 'show_search_icon', false ) ?>

					<?php do_action( 'et_header_top' ); ?>






				</div> <!-- #et-top-navigation -->
			</div> <!-- .container -->

			<div class="et_search_outer">
				<div class="container et_search_form_container">
					<form role="search" method="get" class="et-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
					<?php
						printf( '<input type="search" class="et-search-field" placeholder="%1$s" value="%2$s" name="s" title="%3$s" />',
							esc_attr__( 'Search &hellip;', 'Divi' ),
							get_search_query(),
							esc_attr__( 'Search for:', 'Divi' )
						);
					?>
					</form>
					<span class="et_close_search_field"></span>


				</div>
			</div>
		</header> <!-- #main-header -->

		<div id="et-main-area">
<!-- افزودن باکس اخبار -->
<div id="news-content">
<div style="float:left;font-size:20px" onclick="document.getElementById('news-content').setAttribute (
   'style', 'opacity: 0 !important; right:-150%')"><i class="fa fa-times-circle" aria-hidden="true"></i></div>
	<h6><u>
News and Notifications
		</u><h6>
	

</div>
